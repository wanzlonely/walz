import { Telegraf } from 'telegraf';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { CONFIG, APPEAL_TEXTS } from './config.js';
import { Database } from './lib/database.js';
import { MENUS, Validator, FileHandler, formatTimeLeft, maskEmail, createProgressBar, delay, detectCountry } from './lib/utils.js';
import { WAManager, userSessions, sessionStatus } from './lib/whatsapp.js';

const db = new Database();
const bot = new Telegraf(CONFIG.botToken, { handlerTimeout: 9000000 });
WAManager.init(db, bot);

const userStates = new Map();
const tempStorage = new Map();
const lastBotMessage = new Map();
const checkQueue = [];
let isProcessingCheck = false;

function startSessionMonitor() {
    setInterval(async () => {
        const allUsers = Object.keys(db.users);
        for (const uid of allUsers) {
            const user = db.users[uid];
            if (!user.sessions || user.sessions.length === 0) continue;

            let activeSessions = [];
            let hasChanges = false;
            let deadSessions = [];

            for (const sessId of user.sessions) {
                const key = `${uid}_${sessId}`;
                const status = sessionStatus.get(key);

                if (status === 'logout') {
                    hasChanges = true;
                    deadSessions.push(sessId);
                    sessionStatus.delete(key);
                    
                    if (userSessions.has(uid)) {
                        const socks = userSessions.get(uid);
                        if (socks.has(sessId)) {
                            try { socks.get(sessId).end(); } catch(e){}
                            socks.delete(sessId);
                        }
                    }
                } else {
                    activeSessions.push(sessId);
                }
            }

            if (hasChanges) {
                db.updateUser(uid, { sessions: activeSessions });
                if (deadSessions.length > 0) {
                    try {
                        await bot.telegram.sendMessage(uid, `⚠️ <b>𝗞𝗼𝗻𝗲𝗸𝘀𝗶 𝗧𝗲𝗿𝗽𝘂𝘁𝘂𝘀</b>\n━━━━━━━━━━━━━━━━━━\nSesi ID berikut telah Logout dan dihapus:\n❌ ID: ${deadSessions.join(', ')}\n\n<i>Silakan scan ulang di menu Kelola Perangkat.</i>`, { parse_mode: 'HTML' });
                    } catch (e) {}
                }
            }
        }
    }, 5000);
}

async function deleteUserMsg(ctx) {
    if (ctx.chat.type === 'private') {
        try {
            if (ctx.message) {
                await ctx.deleteMessage(ctx.message.message_id);
            }
        } catch (e) {}
    }
}

async function sendInterface(ctx, text, menu = null, isEdit = false, isPhoto = false) {
    const uid = String(ctx.from.id);
    const chatId = String(ctx.chat.id);
    const msgKey = `${chatId}_${uid}`;

    const lastMsgId = lastBotMessage.get(msgKey);
    const options = { parse_mode: 'HTML' };
    if (menu) options.reply_markup = menu;

    try {
        if (isEdit && lastMsgId) {
            if (isPhoto) {
                await ctx.telegram.editMessageCaption(chatId, lastMsgId, null, text, options);
            } else {
                await ctx.telegram.editMessageText(chatId, lastMsgId, null, text, options);
            }
        } else {
            if (lastMsgId) {
                try { await ctx.telegram.deleteMessage(chatId, lastMsgId); } catch (e) {}
            }

            let sent;
            if (isPhoto) {
                sent = await ctx.replyWithPhoto(CONFIG.botImage, { caption: text, ...options });
            } else {
                sent = await ctx.reply(text, options);
            }
            lastBotMessage.set(msgKey, sent.message_id);
        }
    } catch (e) {
        if (lastMsgId) {
            try { await ctx.telegram.deleteMessage(chatId, lastMsgId); } catch (err) {}
        }
        let sent;
        if (isPhoto) {
            sent = await ctx.replyWithPhoto(CONFIG.botImage, { caption: text, ...options });
        } else {
            sent = await ctx.reply(text, options);
        }
        lastBotMessage.set(msgKey, sent.message_id);
    }
}

const EmailEngine = {
    async verifyConnection(email, pass) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: email, pass: pass },
            tls: { rejectUnauthorized: false }
        });
        try {
            await transporter.verify();
            return true;
        } catch (error) {
            return false;
        }
    },

    async send(subject, bodyText) {
        let ePool = db.emails;
        if (!ePool || ePool.length === 0) throw new Error("Database Email Kosong.");

        let availableIndex = ePool.findIndex(e => e.count < CONFIG.maxCountPerEmail);
        if (availableIndex === -1) {
            throw new Error("LIMIT_GLOBAL_HABIS");
        }

        const emailData = ePool[availableIndex];
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailData.email, pass: emailData.pass },
            tls: { rejectUnauthorized: false }
        });

        try {
            await transporter.sendMail({ from: emailData.email, to: 'support@support.whatsapp.com', subject: subject, text: bodyText });
            ePool[availableIndex].count += 1;
            db.emails = ePool;
            return maskEmail(emailData.email);
        } catch (error) {
            if (error.responseCode === 535) {
                db.removeEmail(availableIndex);
                throw new Error(`Auth Error: ${maskEmail(emailData.email)} dihapus.`);
            }
            throw error;
        }
    }
};

async function runNextCheck() {
    if (isProcessingCheck || checkQueue.length === 0) return;
    isProcessingCheck = true;
    const { ctx, nums, uid } = checkQueue.shift();

    try {
        await sendInterface(ctx, `<b>🆕 𝗪 𝗔 𝗟 𝗭 𝗬 𝗜𝗡𝗧𝗘𝗟𝗟𝗜𝗚𝗘𝗡𝗖𝗘</b>\n━━━━━━━━━━━━━━━━━━\n📦 <b>Antrian:</b> ${nums.length} Nomor\n🚀 <b>Engine:</b> SafeGuard V4\n⏳ <b>Estimasi:</b> ${Math.ceil(nums.length / 30)} Detik\n\n<i>Menginisialisasi protokol aman...</i>`, null, true);
        await processBatchCheck(ctx, nums, uid);
    } catch (error) {
        await sendInterface(ctx, `❌ <b>Sistem Error:</b> ${error.message}`, MENUS.backOnly, true);
    } finally {
        isProcessingCheck = false;
        setTimeout(runNextCheck, 100);
    }
}

async function processBatchCheck(ctx, nums, uid) {
    const getActiveSockets = () => {
        const socksMap = userSessions.get(uid);
        return socksMap ? Array.from(socksMap.values()).filter(s => s.user) : [];
    };

    let activeSockets = getActiveSockets();
    if (activeSockets.length === 0) throw new Error('Koneksi WhatsApp Terputus. Silakan scan ulang.');

    let results = [];
    let invalid = [];
    let processed = 0;
    let lastUiUpdate = 0;

    const BATCH_SIZE = 10;

    const formatIndoDate = (ms) => {
        if (!ms) return "-";
        const d = new Date(ms);
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const updateProgress = async () => {
        try {
            const now = Date.now();
            if ((now - lastUiUpdate > 3000) || processed >= nums.length) {
                lastUiUpdate = now;
                let p = processed > nums.length ? nums.length : processed;
                await sendInterface(ctx, `<b>🆕 𝗪 𝗔 𝗟 𝗭 𝗬 𝗜𝗡𝗧𝗘𝗟𝗟𝗜𝗚𝗘𝗡𝗖𝗘</b>\n━━━━━━━━━━━━━━━━━━\n📦 <b>Progress:</b> ${p}/${nums.length}\n🚀 <b>Status:</b> Deep Fetching\n\n${createProgressBar(p, nums.length)}\n\n<i>Mengambil data realtime...</i>`, null, true);
            }
        } catch (e) {}
    };

    const checkSingle = async (numRaw) => {
        await delay(Math.floor(Math.random() * 800) + 300);
        
        const cleanNum = numRaw.replace(/\D/g, '');
        const jid = cleanNum + '@s.whatsapp.net';

        let currentSockets = getActiveSockets();
        if (currentSockets.length === 0) return { valid: false, num: cleanNum, error: 'NO_CONNECTION' };

        const shuffledSockets = currentSockets.sort(() => 0.5 - Math.random());

        let success = false;
        let data = null;

        for (const sock of shuffledSockets) {
            try {
                const onWaPromise = sock.onWhatsApp(jid);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 8000));

                const [onWa] = await Promise.race([onWaPromise, timeoutPromise]);

                if (onWa && onWa.exists) {
                    try {
                        await sock.presenceSubscribe(jid);
                        await delay(150);
                    } catch(e){}

                    data = {
                        num: cleanNum,
                        bio: "🔒 Privat",
                        bioDate: "-",
                        bioRaw: 9999999999999,
                        bioYear: "-",
                        isBusiness: false,
                        bizVerified: false,
                        bizEmail: "-",
                        bizWeb: "-",
                        bizCat: "-",
                        metaLabel: "👤 Akun Pribadi",
                        jamScore: 30
                    };

                    const [statusRes, bizRes] = await Promise.allSettled([
                        sock.fetchStatus(jid),
                        sock.getBusinessProfile(jid)
                    ]);

                    if (statusRes.status === 'fulfilled' && statusRes.value) {
                        if (statusRes.value.status) {
                            data.bio = statusRes.value.status;
                        }
                        if (statusRes.value.setAt) {
                            const d = new Date(statusRes.value.setAt);
                            data.bioRaw = d.getTime();
                            data.bioDate = formatIndoDate(d);
                            data.bioYear = d.getFullYear();
                        }
                    }

                    if (bizRes.status === 'fulfilled' && bizRes.value) {
                        const biz = bizRes.value;
                        data.isBusiness = true;
                        data.bizEmail = biz.email || "-";
                        data.bizWeb = (biz.website && biz.website.length > 0) ? biz.website[0] : "-";
                        data.bizCat = biz.category?.name || "Bisnis Umum";
                        const bizDesc = biz.description || "";

                        if (biz.verifiedLevel >= 2) {
                            data.bizVerified = true;
                            data.metaLabel = "🏆 Meta Verified";
                            data.jamScore = 100;
                        } else {
                            let completeness = 0;
                            if (data.bizEmail !== "-") completeness++;
                            if (data.bizWeb !== "-") completeness++;
                            if (bizDesc) completeness++;

                            if (completeness >= 2) {
                                data.metaLabel = "🏢 WA Business Pro";
                                data.jamScore = 90;
                            } else {
                                data.metaLabel = "📂 WA Business";
                                data.jamScore = 60;
                            }
                        }

                        if ((data.bio === "🔒 Privat" || data.bio === "") && bizDesc) {
                            data.bio = bizDesc.substring(0, 150).replace(/\n/g, ' ') + (bizDesc.length > 150 ? "..." : "");
                        }
                    }
                    success = true;
                    return { valid: true, data };
                } else {
                    success = true;
                    return { valid: false, num: cleanNum };
                }
            } catch (e) {
                continue;
            }
            if (success) break;
        }

        if (!success) return { valid: false, num: cleanNum, error: 'ALL_SESSIONS_FAILED' };
    };

    for (let i = 0; i < nums.length; i += BATCH_SIZE) {
        if (getActiveSockets().length === 0) break;
        const batch = nums.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(n => checkSingle(n));
        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach(res => {
            if (res.valid) results.push(res.data);
            else invalid.push(res.num);
        });

        processed += batch.length;
        await updateProgress();
        await delay(500); 
    }

    results.sort((a, b) => a.bioRaw - b.bioRaw);

    const stats = {
        total: results.length,
        personal: results.filter(r => !r.isBusiness).length,
        business: results.filter(r => r.isBusiness && !r.bizVerified).length,
        meta: results.filter(r => r.bizVerified).length,
        oldest: results.find(r => r.bioRaw !== 9999999999999)
    };

    let content = `WALZYOS INTELLIGENCE REPORT\n`;
    content += `Date: ${new Date().toLocaleString('id-ID')}\n`;
    content += `========================================\n`;
    content += `📊 SUMMARY DATA\n`;
    content += `├─ ✅ Valid Total  : ${stats.total}\n`;
    content += `├─ 👤 Personal     : ${stats.personal}\n`;
    content += `├─ 🏢 Business     : ${stats.business}\n`;
    content += `└─ 🏆 Meta Verified: ${stats.meta}\n`;
    content += `========================================\n\n`;

    results.forEach((r, index) => {
        let bioAge = "";
        if (r.bioRaw !== 9999999999999) {
            const daysOld = (Date.now() - r.bioRaw) / (1000 * 60 * 60 * 24);
            if (daysOld > 730) bioAge = "[LEGEND]";
            else if (daysOld > 365) bioAge = "[OLD]";
            else if (daysOld < 7) bioAge = "[NEW]";
        }
        
        const country = detectCountry(r.num);

        content += `[${index + 1}] ${r.num} (${country})\n`;
        content += `├── 🏷️ Tipe   : ${r.metaLabel}\n`;
        content += `├── 📝 Bio    : ${r.bio}\n`;
        content += `├── 📅 Update : ${r.bioDate} ${bioAge}\n`;
        
        if (r.isBusiness) {
            content += `├── 🌐 Web    : ${r.bizWeb}\n`;
            content += `├── 📧 Email  : ${r.bizEmail}\n`;
            content += `├── 🏨 Kategori: ${r.bizCat}\n`;
        }
        content += `└── 🛡️ Health : ${r.jamScore}%\n\n`;
    });

    if (invalid.length > 0) {
        content += `\n❌ INVALID (${invalid.length}):\n`;
        invalid.forEach(num => content += `└─ ${num}\n`);
    }

    const filename = `Result_${uid}_${Date.now()}.txt`;
    fs.writeFileSync(filename, content);

    const role = (uid === CONFIG.ownerId || db.isOwner(uid)) ? 'owner' : 'user';

    await sendInterface(ctx, `<b>✅ 𝗔𝗻𝗮𝗹𝗶𝘀𝗶𝘀 𝗦𝗲𝗹𝗲𝘀𝗮𝗶</b>\n━━━━━━━━━━━━━━━━━━\n📊 <b>Total Valid:</b> ${stats.total}\n👤 <b>Pribadi:</b> ${stats.personal}\n🏢 <b>Bisnis:</b> ${stats.business}\n🏆 <b>Meta:</b> ${stats.meta}\n\n🕰️ <b>Tertua:</b> ${stats.oldest ? stats.oldest.bioDate : '-'} (${stats.oldest ? stats.oldest.num : ''})\n\n<i>File laporan lengkap telah dibuat.</i>`, null, true);

    await ctx.replyWithDocument({ source: filename }, { caption: "📄 <b>File Laporan Lengkap</b>", parse_mode: 'HTML' });
    fs.unlinkSync(filename);

    await delay(3000);
    showDashboard(ctx, uid, role, true);
}

const checkAuth = async (ctx) => {
    const uid = String(ctx.from.id);
    let user = db.users[uid];
    const isSuperAdmin = uid === CONFIG.ownerId;
    const isOwner = db.isOwner(uid);

    if (db.settings.maintenance && !isSuperAdmin) {
        await sendInterface(ctx, `<b>⚠️ 𝗦𝗲𝗱𝗮𝗻𝗴 𝗣𝗲𝗺𝗲𝗹𝗶𝗵𝗮𝗿𝗮𝗮𝗻</b>\nServer sedang diupdate oleh developer. Silakan kembali nanti.`, null);
        return false;
    }

    const currentName = ctx.from.username ? `@${ctx.from.username}` : (ctx.from.first_name || 'User');
    if (!user) {
        user = { id: uid, username: currentName, joined: Date.now(), expired: 0 };
        if (uid === CONFIG.ownerId) user.expired = 9999999999999;
        db.updateUser(uid, user);
    } else if (user.username !== currentName) db.updateUser(uid, { username: currentName });

    if (!isSuperAdmin && !isOwner && !(await isGroupMember(ctx, uid))) {
        await ctx.replyWithPhoto(CONFIG.botImage, {
            caption: `<b>⛔ 𝗔𝗸𝘀𝗲𝘀 𝗗𝗶𝘁𝗼𝗹𝗮𝗸</b>\n━━━━━━━━━━━━━━━━━━\nAnda belum terdaftar di database komunitas kami.\nSilakan masuk ke grup resmi terlebih dahulu.`,
            parse_mode: 'HTML', reply_markup: MENUS.verify
        });
        return false;
    }
    return isSuperAdmin ? 'superadmin' : (isOwner ? 'owner' : 'user');
};

const validatePremium = async (ctx) => {
    const uid = String(ctx.from.id);
    const u = db.users[uid];
    if (uid === CONFIG.ownerId || db.isOwner(uid)) return true;

    if (!u || u.expired < Date.now()) {
        await sendInterface(ctx, `⛔ <b>𝗔𝗸𝘀𝗲𝘀 𝗞𝗮𝗱𝗮𝗹𝘂𝗮𝗿𝘀𝗮</b>\n━━━━━━━━━━━━━━━━━━\nMasa aktif akun Anda telah habis.\nSilakan lakukan perpanjangan (Top Up) untuk menggunakan fitur Premium ini kembali.\n\n<i>Klik menu Buy Premium untuk membeli.</i>`, MENUS.mainUser, true);
        return false;
    }
    return true;
};

async function showDashboard(ctx, uid, role, isEdit = false) {
    const u = db.users[uid] || {};
    let activeSessions = 0;
    if (u.sessions) {
        for (const s of [...u.sessions]) {
            const st = sessionStatus.get(`${uid}_${s}`);
            if (st === 'open' || st === 'connecting') activeSessions++;
        }
    }

    let menu = role === 'superadmin' ? MENUS.mainAdmin : (role === 'owner' ? MENUS.mainAdmin : MENUS.mainUser);
    let roleName = role === 'superadmin' ? '👑 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿' : (role === 'owner' ? '🛡️ 𝗔𝗱𝗺𝗶𝗻' : (u.expired > Date.now() ? '💎 𝗣𝗿𝗲𝗺𝗶𝘂𝗺' : '💀 𝗚𝘂𝗲𝘀𝘁'));
    const latency = Math.floor(Math.random() * 30 + 10);
    const memory = Math.floor(activeSessions * 10 + 20);

    const caption = `<b>𝗪 𝗔 𝗟 𝗭 𝗬 𝗘 𝗫 𝗣 𝗟 𝗢 𝗜 𝗧</b>
━━━━━━━━━━━━━━━━━━
<b>👤 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘀𝗶 𝗔𝗸𝘂𝗻</b>
<b>🏷️ 𝗡𝗮𝗺𝗮   :</b> ${u.username}
<b>🆔 𝗨𝗜𝗗    :</b> <code>${uid}</code>
<b>🔐 𝗥𝗼𝗹𝗲    :</b> ${roleName}
<b>⏳ 𝗗𝘂𝗿𝗮𝘀𝗶  :</b> ${formatTimeLeft(u.expired)}

<b>⚙️ 𝗦𝘁𝗮𝘁𝘂𝘀 𝗦𝗶𝘀𝘁𝗲𝗺</b>
<b>🟢 𝗦𝗲𝗿𝘃𝗲𝗿  :</b> 𝗢𝗻𝗹𝗶𝗻𝗲
<b>⚡ 𝗟𝗮𝘁𝗲𝗻𝗰𝘆 :</b> <code>${latency}𝗺𝘀</code>
<b>💾 𝗠𝗲𝗺𝗼𝗿𝘆  :</b> <code>${memory}%</code>
<b>📱 𝗗𝗲𝘃𝗶𝗰𝗲  :</b> <code>${activeSessions}/5</code> 𝗧𝗲𝗿𝗵𝘂𝗯𝘂𝗻𝗴
━━━━━━━━━━━━━━━━━━
<i>Pilih menu di bawah untuk memulai operasi.</i>`;

    await sendInterface(ctx, caption, menu, isEdit, true);
}

async function isGroupMember(ctx, uid) {
    if (CONFIG.groupId === '0' || uid === CONFIG.ownerId || db.isOwner(uid)) return true;
    try {
        const member = await ctx.telegram.getChatMember(CONFIG.groupId, uid);
        return ['creator', 'administrator', 'member'].includes(member.status);
    } catch (e) { return false; }
}

bot.start(async (ctx) => {
    userStates.delete(String(ctx.from.id));
    const role = await checkAuth(ctx);
    if (role) {
        await showDashboard(ctx, String(ctx.from.id), role);
    }
});

bot.action('verify_join', async (ctx) => {
    const uid = String(ctx.from.id);
    const role = await checkAuth(ctx);
    if (role) showDashboard(ctx, uid, role, true);
    else ctx.answerCbQuery('Wajib masuk grup dulu!', { show_alert: true });
});

bot.action('back_home', async (ctx) => {
    const uid = String(ctx.from.id);
    const role = (uid === CONFIG.ownerId || db.isOwner(uid)) ? (uid === CONFIG.ownerId ? 'superadmin' : 'owner') : 'user';
    userStates.delete(uid);
    showDashboard(ctx, uid, role, true);
});

bot.action('menu_fix', async (ctx) => {
    if (!await validatePremium(ctx)) return;
    const uid = String(ctx.from.id);
    if (!db.hasAvailableEmail()) {
        return sendInterface(ctx, `<b>⚠️ 𝗟𝗶𝗺𝗶𝘁 𝗧𝗲𝗿𝗰𝗮𝗽𝗮𝗶</b>\n\nSemua email telah mencapai batas harian.\nFitur <b>Fix WA</b> dinonaktifkan sementara.\n\n<i>Reset otomatis besok jam 00:00.</i>`, MENUS.backOnly, true);
    }
    sendInterface(ctx, '🔧 <b>𝗠𝗲𝗻𝘂 𝗣𝗲𝗿𝗯𝗮𝗶𝗸𝗮𝗻</b>\n\nSilakan pilih jenis masalah akun WhatsApp yang Anda alami.', MENUS.fixMenu, true);
});

bot.action('menu_check', async (ctx) => {
    if (!await validatePremium(ctx)) return;
    const uid = String(ctx.from.id);
    const hasSession = userSessions.has(uid) && Array.from(userSessions.get(uid).values()).some(s => s.user);
    if (!hasSession) {
        return sendInterface(ctx, `<b>⛔ 𝗔𝗸𝘀𝗲𝘀 𝗗𝗶𝘁𝗼𝗹𝗮𝗸</b>\n\nAnda belum menghubungkan WhatsApp.\nSilakan ke menu <b>Pengaturan > Kelola Perangkat</b> terlebih dahulu.`, MENUS.backOnly, true);
    }
    userStates.set(uid, 'CHECK_BIO');
    sendInterface(ctx, '🔎 <b>𝗖𝗲𝗸 𝗕𝗶𝗼 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽</b>\n\nSilakan kirim nomor (628xxx) atau file (TXT/Excel). Bot akan menganalisa status nomor tersebut secara mendalam.', MENUS.backOnly, true);
});

bot.action('menu_settings', (ctx) => {
    const uid = String(ctx.from.id);
    const m = (uid === CONFIG.ownerId || db.isOwner(uid)) ? MENUS.settingsAdmin : MENUS.settingsUser;
    sendInterface(ctx, '⚙️ <b>𝗣𝗲𝗻𝗴𝗮𝘁𝘂𝗿𝗮𝗻</b>\n\nKelola perangkat koneksi atau email sistem di sini.', m, true);
});
bot.action('menu_device', (ctx) => sendInterface(ctx, '📱 <b>𝗠𝗮𝗻𝗮𝗷𝗲𝗺𝗲𝗻 𝗣𝗲𝗿𝗮𝗻𝗴𝗸𝗮𝘁</b>\n\nHubungkan WhatsApp Scanner agar bot bisa bekerja.', MENUS.deviceMenu, true));
bot.action('menu_email', (ctx) => sendInterface(ctx, '📧 <b>𝗠𝗮𝗻𝗮𝗷𝗲𝗺𝗲𝗻 𝗘𝗺𝗮𝗶𝗹</b>\n\nKelola akun Gmail SMTP untuk fitur perbaikan otomatis.', MENUS.emailMenu, true));
bot.action('menu_users', (ctx) => sendInterface(ctx, '👥 <b>𝗠𝗮𝗻𝗮𝗷𝗲𝗺𝗲𝗻 𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮</b>\n\nKelola akses dan masa aktif member.', MENUS.userMenu, true));
bot.action('menu_owner', (ctx) => sendInterface(ctx, '👑 <b>𝗣𝗮𝗻𝗲𝗹 𝗗𝗲𝘄𝗮</b>\n\nAkses khusus pemilik bot.', MENUS.ownerMenu, true));
bot.action('menu_convert', async (ctx) => {
    if (!await validatePremium(ctx)) return;
    userStates.set(String(ctx.from.id), 'CONVERT_XLSX');
    sendInterface(ctx, '📂 <b>𝗞𝗼𝗻𝘃𝗲𝗿𝘀𝗶 𝗙𝗶𝗹𝗲</b>\n\nKirim file Excel/TXT yang berantakan, bot akan mengambil nomornya saja.', MENUS.backOnly, true);
});
bot.action('my_profile', async (ctx) => {
    const uid = String(ctx.from.id);
    const role = (uid === CONFIG.ownerId || db.isOwner(uid)) ? 'owner' : 'user';
    showDashboard(ctx, uid, role, true);
});
bot.action('buy_access', (ctx) => sendInterface(ctx, `💎 <b>𝗕𝗲𝗹𝗶 𝗣𝗿𝗲𝗺𝗶𝘂𝗺</b>\n\nNikmati akses ke semua fitur canggih tanpa batas.\n\n💰 <b>Harga:</b> Rp 10.000 / Bulan\n💳 <b>Scan QRIS di atas untuk membayar.</b>\n\n<i>Kirim bukti transfer di sini setelah membayar.</i>`, MENUS.backOnly, true, true));

bot.action('act_fix_red', (ctx) => { userStates.set(String(ctx.from.id), 'FIX_RED_INPUT'); sendInterface(ctx, '🔧 <b>𝗜𝗻𝗽𝘂𝘁 𝗡𝗼𝗺𝗼𝗿</b>\n\nMasukkan nomor yang mengalami masalah login (Hubungi Dukungan).\nContoh: 628123456789', MENUS.backOnly, true); });
bot.action('act_unban_spam', (ctx) => { userStates.set(String(ctx.from.id), 'UNBAN_INPUT'); tempStorage.set(String(ctx.from.id), {type:'spam'}); sendInterface(ctx, '🚫 <b>𝗜𝗻𝗽𝘂𝘁 𝗡𝗼𝗺𝗼𝗿</b>\n\nMasukkan nomor yang terkena spam (Blokir Sementara).', MENUS.backOnly, true); });
bot.action('act_unban_perm', (ctx) => { userStates.set(String(ctx.from.id), 'UNBAN_INPUT'); tempStorage.set(String(ctx.from.id), {type:'permanen'}); sendInterface(ctx, '⛔ <b>𝗜𝗻𝗽𝘂𝘁 𝗡𝗼𝗺𝗼𝗿</b>\n\nMasukkan nomor yang terblokir permanen.', MENUS.backOnly, true); });

bot.action('dev_add', (ctx) => { userStates.set(String(ctx.from.id), 'ADD_WA_NUM'); sendInterface(ctx, '📱 <b>𝗧𝗮𝗺𝗯𝗮𝗵 𝗣𝗲𝗿𝗮𝗻𝗴𝗸𝗮𝘁</b>\n\nMasukkan nomor HP yang akan dijadikan scanner (628xxx).', MENUS.backOnly, true); });
bot.action('dev_del', (ctx) => { userStates.set(String(ctx.from.id), 'DEL_SESSION_ID'); sendInterface(ctx, '🗑️ <b>𝗛𝗮𝗽𝘂𝘀 𝗦𝗲𝘀𝗶</b>\n\nMasukkan ID Sesi (angka) yang ingin dihapus.\nLihat daftar sesi di menu sebelumnya.', MENUS.backOnly, true); });
bot.action('dev_list', (ctx) => {
    const s = db.users[String(ctx.from.id)].sessions || [];
    const t = s.length > 0 ? s.map(x => {
        const status = sessionStatus.get(`${ctx.from.id}_${x}`);
        const icon = (status === 'open') ? '🟢' : '🔴';
        return `${icon} Perangkat ${x}`;
    }).join('\n') : 'Tidak ada perangkat.';
    sendInterface(ctx, `📱 <b>𝗟𝗶𝘀𝘁 𝗦𝗲𝘀𝗶</b>\n━━━━━━━━━━━━━━━━━━\n${t}`, MENUS.deviceMenu, true);
});

bot.action('email_add', (ctx) => { userStates.set(String(ctx.from.id), 'SETUP_EMAIL_ADDR'); sendInterface(ctx, '📧 <b>𝗧𝗮𝗺𝗯𝗮𝗵 𝗘𝗺𝗮𝗶𝗹</b>\n\nMasukkan alamat Gmail Anda.', MENUS.backOnly, true); });
bot.action('email_list', (ctx) => {
    const em = db.emails || [];
    const t = em.length > 0 ? em.map((e, i) => `${i+1}. ${maskEmail(e.email)} [${e.count}/${CONFIG.maxCountPerEmail}]`).join('\n') : 'Belum ada email.';
    sendInterface(ctx, `📧 <b>𝗗𝗮𝗳𝘁𝗮𝗿 𝗘𝗺𝗮𝗶𝗹</b>\n━━━━━━━━━━━━━━━━━━\n${t}`, MENUS.emailMenu, true);
});
bot.action('email_del', (ctx) => { userStates.set(String(ctx.from.id), 'DEL_EMAIL_INDEX'); sendInterface(ctx, '🗑️ <b>𝗛𝗮𝗽𝘂𝘀 𝗘𝗺𝗮𝗶𝗹</b>\n\nMasukkan nomor urut email yang ingin dihapus.', MENUS.backOnly, true); });

bot.action('user_list', (ctx) => {
    const us = Object.values(db.users).slice(0, 30);
    const t = us.map((u, i) => `${i+1}. <b>${u.username}</b>\n   🆔 <code>${u.id}</code>\n   ⏳ ${formatTimeLeft(u.expired)}`).join('\n\n');
    sendInterface(ctx, `👥 <b>𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗨𝘀𝗲𝗿 (Top 30)</b>\n━━━━━━━━━━━━━━━━━━\nTotal: ${Object.keys(db.users).length}\n\n${t}`, MENUS.userMenu, true);
});
bot.action('user_add_time', (ctx) => { userStates.set(String(ctx.from.id), 'ADD_TIME_ID'); sendInterface(ctx, '➕ <b>𝗧𝗮𝗺𝗯𝗮𝗵 𝗗𝘂𝗿𝗮𝘀𝗶</b>\n\nMasukkan ID User tujuan.', MENUS.backOnly, true); });
bot.action('user_cut_time', (ctx) => { userStates.set(String(ctx.from.id), 'DEL_TIME_ID'); sendInterface(ctx, '➖ <b>𝗣𝗼𝘁𝗼𝗻𝗴 𝗗𝘂𝗿𝗮𝘀𝗶</b>\n\nMasukkan ID User tujuan.', MENUS.backOnly, true); });

bot.action('own_add_admin', (ctx) => { userStates.set(String(ctx.from.id), 'ADD_OWNER_ID'); sendInterface(ctx, '🛡️ <b>𝗧𝗮𝗺𝗯𝗮𝗵 𝗔𝗱𝗺𝗶𝗻</b>\n\nMasukkan ID Telegram calon admin.', MENUS.backOnly, true); });
bot.action('own_del_admin', (ctx) => { userStates.set(String(ctx.from.id), 'DEL_OWNER_ID'); sendInterface(ctx, '🗑️ <b>𝗛𝗮𝗽𝘂𝘀 𝗔𝗱𝗺𝗶𝗻</b>\n\nMasukkan ID Telegram admin.', MENUS.backOnly, true); });
bot.action('own_bc', (ctx) => { userStates.set(String(ctx.from.id), 'BROADCAST_MSG'); sendInterface(ctx, '📢 <b>𝗕𝗿𝗼𝗮𝗱𝗰𝗮𝘀𝘁</b>\n\nKirim pesan yang akan disebar.', MENUS.backOnly, true); });
bot.action('own_template_menu', (ctx) => { sendInterface(ctx, ' 📝 <b>𝗣𝗶𝗹𝗶𝗵 𝗝𝗲𝗻𝗶𝘀 𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲</b>\n\nPilih tipe pesan yang ingin diedit.', MENUS.templateMenu, true); });
bot.action('tpl_fixred', (ctx) => { userStates.set(String(ctx.from.id), 'SETUP_TEMPLATE_SUBJ'); tempStorage.set(String(ctx.from.id), {tplType:'fixred'}); sendInterface(ctx, '📝 <b>𝗘𝗱𝗶𝘁 𝗙𝗶𝘅 𝗠𝗲𝗿𝗮𝗵</b>\n\nMasukkan Judul (Subject) Email Baru:', MENUS.backOnly, true); });
bot.action('tpl_spam', (ctx) => { userStates.set(String(ctx.from.id), 'SETUP_TEMPLATE_SUBJ'); tempStorage.set(String(ctx.from.id), {tplType:'spam'}); sendInterface(ctx, '📝 <b>𝗘𝗱𝗶𝘁 𝗨𝗻𝗯𝗮𝗻 𝗦𝗽𝗮𝗺</b>\n\nMasukkan Judul (Subject) Email Baru:', MENUS.backOnly, true); });
bot.action('tpl_permanen', (ctx) => { userStates.set(String(ctx.from.id), 'SETUP_TEMPLATE_SUBJ'); tempStorage.set(String(ctx.from.id), {tplType:'permanen'}); sendInterface(ctx, '📝 <b>𝗘𝗱𝗶𝘁 𝗨𝗻𝗯𝗮𝗻 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻</b>\n\nMasukkan Judul (Subject) Email Baru:', MENUS.backOnly, true); });

bot.action('own_backup', async (ctx) => {
    await ctx.replyWithDocument({ source: db.paths.users, filename: 'Users.json' });
    await ctx.replyWithDocument({ source: db.paths.emails, filename: 'Emails.json' });
    await ctx.replyWithDocument({ source: db.paths.settings, filename: 'Settings.json' });
});
bot.action('own_mt', (ctx) => {
    let s = db.settings; s.maintenance = !s.maintenance; db.settings = s;
    sendInterface(ctx, `🚧 <b>𝗠𝗮𝗶𝗻𝘁𝗲𝗻𝗮𝗻𝗰𝗲:</b> ${s.maintenance ? 'ON' : 'OFF'}`, MENUS.ownerMenu, true);
});

bot.action(/^approve_(\w+)_(\d+)$/, async (ctx) => {
    if (ctx.from.id.toString() !== CONFIG.ownerId) return;
    const type = ctx.match[1];
    const targetId = ctx.match[2];
    db.updateUser(targetId, { expired: (Date.now() + 2592000000) });
    await ctx.editMessageCaption(`✅ <b>𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱:</b> Akses Diberikan`, { parse_mode: 'HTML' });
    await bot.telegram.sendMessage(targetId, `✅ <b>𝗣𝗲𝗺𝗯𝗮𝘆𝗮𝗿𝗮𝗻 𝗗𝗶𝘁𝗲𝗿𝗶𝗺𝗮</b>\nSelamat! Akun Premium Anda aktif selama 30 Hari.`);
});

bot.action(/^reject_(\d+)$/, async (ctx) => {
    if (ctx.from.id.toString() !== CONFIG.ownerId) return;
    await ctx.editMessageCaption(`❌ <b>𝗗𝗶𝘁𝗼𝗹𝗮𝗸</b>`, { parse_mode: 'HTML' });
    await bot.telegram.sendMessage(ctx.match[1], `❌ Bukti pembayaran ditolak admin.`);
});

bot.on(['text', 'photo'], async (ctx) => {
    const uid = String(ctx.from.id);
    const state = userStates.get(uid);

    if (ctx.chat.type !== 'private' && !state) return;

    await deleteUserMsg(ctx);
    const text = ctx.message.text || ctx.message.caption || '';

    if (!state) return;

    if (state === 'ADD_WA_NUM') {
        const num = text.replace(/\D/g, '');
        if (!Validator.number(num)) return sendInterface(ctx, ' ⛔ <b>𝗙𝗢𝗥𝗠𝗔𝗧 𝗜𝗡𝗩𝗔𝗟𝗜𝗗</b>\nGunakan nomor 628xxx.', MENUS.backOnly, true);
        await sendInterface(ctx, '⏳ <b>Menghubungkan...</b>', MENUS.backOnly, true);
        try {
            const code = await WAManager.requestPairing(uid, num);
            await sendInterface(ctx, `🔐 <b>𝗞𝗼𝗱𝗲 𝗣𝗮𝗶𝗿𝗶𝗻𝗴:</b> <code>${code}</code>\n\nMasukkan kode ini di WhatsApp.`, MENUS.deviceMenu, true);
            userStates.delete(uid);
        } catch (e) { sendInterface(ctx, `❌ <b>Gagal:</b> ${e.message}`, MENUS.backOnly, true); }
    }
    else if (state === 'DEL_SESSION_ID') {
        const sessId = parseInt(text);
        if (isNaN(sessId)) return sendInterface(ctx, '⛔ <b>INPUT HARUS ANGKA</b>', MENUS.backOnly, true);

        try {
            await WAManager.deleteSession(uid, sessId);
            sendInterface(ctx, `✅ <b>Sesi ${sessId} Berhasil Dihapus.</b>`, MENUS.deviceMenu, true);
        } catch (e) {
            sendInterface(ctx, `❌ <b>Gagal:</b> ${e.message}`, MENUS.deviceMenu, true);
        }
        userStates.delete(uid);
    }
    else if (state === 'SETUP_EMAIL_ADDR') {
        if (!Validator.email(text)) return sendInterface(ctx, ' ⛔ <b>𝗘𝗠𝗔𝗜𝗟 𝗜𝗡𝗩𝗔𝗟𝗜𝗗</b>\nHanya menerima @gmail.com.', MENUS.backOnly, true);
        tempStorage.set(uid, { email: text.trim() });
        userStates.set(uid, 'SETUP_EMAIL_PASS');
        sendInterface(ctx, '🔑 <b>𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱 𝗔𝗽𝗹𝗶𝗸𝗮𝘀𝗶:</b>\nMasukkan 16 digit App Password Google.', MENUS.backOnly, true);
    }
    else if (state === 'SETUP_EMAIL_PASS') {
        const pass = text.replace(/\s+/g, '');
        if (!Validator.appPass(pass)) return sendInterface(ctx, '⛔ <b>𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗 𝗜𝗡𝗩𝗔𝗟𝗜𝗗</b>\nHarus 16 karakter tanpa spasi.', MENUS.backOnly, true);
        const email = tempStorage.get(uid).email;
        await sendInterface(ctx, '⏳ <b>Memverifikasi...</b>', MENUS.backOnly, true);
        const valid = await EmailEngine.verifyConnection(email, pass);
        if (valid) {
            db.addEmail(email, pass);
            sendInterface(ctx, '✅ <b>Email Tersimpan.</b>', MENUS.emailMenu, true);
            userStates.delete(uid);
        } else { sendInterface(ctx, '❌ <b>Gagal Login.</b> Cek password dan coba lagi.', MENUS.backOnly, true); }
    }
    else if (state === 'DEL_EMAIL_INDEX') {
        const idx = parseInt(text) - 1;
        if (isNaN(idx)) return sendInterface(ctx, '⛔ <b>𝗜𝗡𝗣𝗨𝗧 𝗔𝗡𝗚𝗞𝗔</b>', MENUS.backOnly, true);
        if (db.removeEmail(idx)) { sendInterface(ctx, '✅ <b>Email Dihapus.</b>', MENUS.emailMenu, true); userStates.delete(uid); }
        else sendInterface(ctx, '⚠️ <b>Tidak Ditemukan.</b> Coba lagi.', MENUS.backOnly, true);
    }
    else if (state === 'CHECK_BIO') {
        const nums = text.match(/\d{8,15}/g);
        if (!nums) return sendInterface(ctx, '⛔ <b>𝗧𝗜𝗗𝗔𝗞 𝗔𝗗𝗔 𝗡𝗢𝗠𝗢𝗥</b>\nKirim format yang benar.', MENUS.backOnly, true);
        userStates.delete(uid);
        checkQueue.push({ ctx, nums, uid });
        if (!isProcessingCheck) runNextCheck();
    }
    else if (['FIX_RED_INPUT', 'UNBAN_INPUT'].includes(state)) {
        const num = text.replace(/\D/g, '');
        if (!Validator.number(num)) return sendInterface(ctx, ' ⛔ <b>𝗙𝗢𝗥𝗠𝗔𝗧 𝗦𝗔𝗟𝗔𝗛</b>\nGunakan awalan 628xxx.', MENUS.backOnly, true);
        const country = detectCountry(num);
        const templates = state === 'FIX_RED_INPUT' ? APPEAL_TEXTS.fixred : (tempStorage.get(uid).type === 'spam' ? APPEAL_TEXTS.spam : APPEAL_TEXTS.permanen);
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

        const frames = ['▰▱▱▱▱', '▰▰▱▱▱', '▰▰▰▱▱', '▰▰▰▰▱', '▰▰▰▰▰'];
        for (const frame of frames) {
            await sendInterface(ctx, `<b>🚀 𝗦𝗘𝗡𝗗𝗜𝗡𝗚 𝗥𝗘𝗤𝗨𝗘𝗦𝗧...</b>\n\n${frame}\n\n📱 <b>Target:</b> ${num}\n🌍 <b>Region:</b> ${country}`, MENUS.backOnly, true);
            await delay(800);
        }

        try {
            const used = await EmailEngine.send(randomTemplate.subject, randomTemplate.body.replace('{nomor}', num));
            
            const msg = `𝙰𝙿𝙿𝙴𝙰𝙻 𝚂𝙴𝙽𝚃 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈\n` +
                        `𝚃𝙰𝚁𝙶𝙴𝚃: ${num}\n\n` +
                        `𝚂𝙴𝙽𝙳𝙴𝚁 𝙸𝙳: 1\n` +
                        `𝚃𝙾 𝙼𝙰𝙸𝙻: support@support.whatsapp.com\n` +
                        `𝚂𝚄𝙱𝙹𝙴𝙲𝚃: ${randomTemplate.subject}\n` +
                        `𝙼𝙴𝚃𝙷𝙾𝙳: 𝙰𝙿𝙸 𝚅𝙴𝚁𝙲𝙴𝙻\n` +
                        `𝙻𝙸𝙼𝙸𝚃: ∞\n\n` +
                        `𝚂𝚃𝙰𝚃𝚄𝚂: 🎉 Email berhasil dikirim!\n` +
                        `📧: ${used}`;

            sendInterface(ctx, msg, MENUS.fixMenu, true);
        } catch(e) {
            if (e.message.includes('LIMIT_GLOBAL_HABIS')) {
                sendInterface(ctx, `⚠️ <b>Limit Habis</b>\nSemua email telah mencapai batas harian.`, MENUS.fixMenu, true);
            } else {
                sendInterface(ctx, `❌ Gagal: ${e.message}`, MENUS.backOnly, true);
            }
        }
        userStates.delete(uid);
    }
    else if (state === 'ADD_TIME_ID') {
        tempStorage.set(uid, { target: text.trim() });
        userStates.set(uid, 'ADD_TIME_DAYS');
        sendInterface(ctx, '📅 <b>Jumlah Hari:</b>', MENUS.backOnly, true);
    }
    else if (state === 'ADD_TIME_DAYS') {
        const days = parseInt(text);
        if (!Validator.days(text)) return sendInterface(ctx, '⛔ <b>𝗛𝗔𝗥𝗨𝗦 𝗔𝗡𝗚𝗞𝗔</b>', MENUS.backOnly, true);
        const target = tempStorage.get(uid).target;
        const u = db.users[target];
        if (u) {
            db.updateUser(target, { expired: (u.expired > Date.now() ? u.expired : Date.now()) + (days*86400000) });
            sendInterface(ctx, `✅ <b>Ditambahkan ${days} hari.</b>`, MENUS.userMenu, true);
        } else sendInterface(ctx, '❌ <b>User Tidak Ada.</b>', MENUS.backOnly, true);
        userStates.delete(uid);
    }
    else if (state === 'DEL_TIME_ID') {
        tempStorage.set(uid, { target: text.trim() });
        userStates.set(uid, 'DEL_TIME_DAYS');
        sendInterface(ctx, '📅 <b>Potong Hari:</b>', MENUS.backOnly, true);
    }
    else if (state === 'DEL_TIME_DAYS') {
        const days = parseInt(text);
        if (!Validator.days(text)) return sendInterface(ctx, '⛔ <b>𝗛𝗔𝗥𝗨𝗦 𝗔𝗡𝗚𝗞𝗔</b>', MENUS.backOnly, true);
        const target = tempStorage.get(uid).target;
        const u = db.users[target];
        if (u) {
            let n = u.expired - (days*86400000);
            if(n < Date.now()) n = 0;
            db.updateUser(target, { expired: n });
            sendInterface(ctx, `✅ <b>Dipotong</b>`, MENUS.userMenu, true);
        } else sendInterface(ctx, '❌ <b>User Tidak Ada.</b>', MENUS.backOnly, true);
        userStates.delete(uid);
    }
    else if (state === 'BROADCAST_MSG') {
        const users = Object.keys(db.users);
        await sendInterface(ctx, `📢 <b>Mengirim ke ${users.length} user...</b>`, MENUS.backOnly, true);
        let success = 0;
        for (const u of users) {
            try {
                await bot.telegram.copyMessage(u, ctx.chat.id, ctx.message.message_id);
                success++;
                await delay(200);
            } catch(e){}
        }
        sendInterface(ctx, `✅ <b>Broadcast Selesai</b>\nSukses: ${success}`, MENUS.superAdminPanel, true);
        userStates.delete(uid);
    }
    else if (state === 'ADD_OWNER_ID') {
        db.addOwner(text.trim());
        sendInterface(ctx, '✅ <b>Selesai</b>', MENUS.superAdminPanel, true);
        userStates.delete(uid);
    }
    else if (state === 'DEL_OWNER_ID') {
        db.removeOwner(text.trim());
        sendInterface(ctx, '✅ <b>Selesai</b>', MENUS.superAdminPanel, true);
        userStates.delete(uid);
    }
    else if (state === 'SETUP_TEMPLATE_SUBJ') {
        tempStorage.set(uid, { ...tempStorage.get(uid), subj: text });
        userStates.set(uid, 'SETUP_TEMPLATE_BODY');
        sendInterface(ctx, '📝 <b>Masukkan Isi Email:</b>\nGunakan {nomor} sebagai variabel.', MENUS.backOnly, true);
    }
    else if (state === 'SETUP_TEMPLATE_BODY') {
        if (!text.includes('{nomor}')) {
            return sendInterface(ctx, '⛔ <b>𝗙𝗢𝗥𝗠𝗔𝗧 𝗗𝗜𝗧𝗢𝗟𝗔𝗞</b>\n\nTemplate harus mengandung variabel <code>{nomor}</code> agar sistem bisa bekerja.\nSilakan kirim ulang isi email yang benar.', MENUS.backOnly, true);
        }
        const type = tempStorage.get(uid).tplType;
        const subj = tempStorage.get(uid).subj;
        db.updateTemplate(type, subj, text);
        sendInterface(ctx, '✅ <b>Template Disimpan</b>', MENUS.superAdminPanel, true);
        userStates.delete(uid);
    }
    else if (state === 'WAITING_PROOF' && ctx.message.photo) {
        const pType = tempStorage.get(uid).purchaseType;
        await bot.telegram.sendPhoto(CONFIG.ownerId, ctx.message.photo[ctx.message.photo.length-1].file_id, {
            caption: `💸 <b>Order Baru:</b> ${pType}\nUser: @${ctx.from.username} (${uid})`,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [[{ text: '✅ Terima', callback_data: `approve_${pType}_${uid}` }, { text: '❌ Tolak', callback_data: `reject_${uid}` }]] }
        });
        sendInterface(ctx, '⏳ <b>Bukti Terkirim.</b> Tunggu konfirmasi admin.', MENUS.mainUser, true);
        userStates.delete(uid);
    }
});

bot.on('document', async (ctx) => {
    const uid = String(ctx.from.id);
    const state = userStates.get(uid);

    if (ctx.chat.type !== 'private' && !state) return;
    await deleteUserMsg(ctx);

    if (state === 'CHECK_BIO') {
        const link = await bot.telegram.getFileLink(ctx.message.document.file_id);
        const nums = await FileHandler.process(link.href, ctx.message.document.file_name);
        if (nums.length > 0) {
            userStates.delete(uid);
            checkQueue.push({ ctx, nums, uid });
            if (!isProcessingCheck) runNextCheck();
        } else sendInterface(ctx, '⛔ <b>FILE KOSONG</b>', MENUS.backOnly, true);
    }
    else if (state === 'CONVERT_XLSX') {
        const link = await bot.telegram.getFileLink(ctx.message.document.file_id);
        const nums = await FileHandler.process(link.href, ctx.message.document.file_name);
        const txtFile = `Clean_${Date.now()}.txt`;
        fs.writeFileSync(txtFile, nums.join('\n'));
        await ctx.replyWithDocument({ source: txtFile }, { caption: `✅ <b>Selesai:</b> ${nums.length} Nomor.` });
        fs.unlinkSync(txtFile);
        userStates.delete(uid);
        const role = (uid === CONFIG.ownerId || db.isOwner(uid)) ? 'owner' : 'user';
        showDashboard(ctx, uid, role, true);
    }
});

(async () => {
    console.log('😹🖕WalzyOS 18 System Booted...');
    await WAManager.loadAll();
    startSessionMonitor();
    await bot.launch({ dropPendingUpdates: true });
})();
