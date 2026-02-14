import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { pino } from "pino";
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';
import { delay } from './utils.js';

export const userSessions = new Map();
export const sessionStatus = new Map();

export const WAManager = {
    db: null,
    bot: null,

    init(dbInstance, botInstance) {
        this.db = dbInstance;
        this.bot = botInstance;
    },

    async loadAll() {
        const users = this.db.users;
        for (const uid in users) {
            if (users[uid].sessions && Array.isArray(users[uid].sessions)) {
                for (const sessId of users[uid].sessions) {
                    await delay(500);
                    this.startSession(uid, sessId);
                }
            }
        }
    },

    async requestPairing(userId, phoneNumber) {
        const uid = String(userId);
        let u = this.db.users[uid];
        
        if (!u.sessions) u.sessions = [];
        if (u.sessions.length >= 5) throw new Error("Maksimal 5 Sesi Per Akun.");

        let sessId = 1;
        while (u.sessions.includes(sessId)) sessId++;

        const authPath = path.join(CONFIG.dbPath, `session_${uid}_${sessId}`);
        if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });

        u.sessions.push(sessId);
        this.db.updateUser(uid, { sessions: u.sessions });

        const sock = await this.startSession(uid, sessId);
        
        await delay(3000);

        try {
            const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
            if (!sock.authState.creds.me && !sock.authState.creds.registered) {
                const code = await sock.requestPairingCode(cleanPhone);
                return code;
            } else {
                throw new Error("Sesi ini sudah terdaftar.");
            }
        } catch (e) {
            this.deleteSession(uid, sessId);
            throw new Error("Gagal mengambil kode pairing.");
        }
    },

    async deleteSession(userId, sessionId) {
        const uid = String(userId);
        
        if (userSessions.has(uid)) {
            const userMap = userSessions.get(uid);
            if (userMap.has(sessionId)) {
                try {
                    const sock = userMap.get(sessionId);
                    sock.ev.removeAllListeners('connection.update');
                    sock.ev.removeAllListeners('creds.update');
                    sock.end(undefined);
                } catch (e) {}
                userMap.delete(sessionId);
            }
            if (userMap.size === 0) userSessions.delete(uid);
        }

        sessionStatus.delete(`${uid}_${sessionId}`);
        
        const u = this.db.users[uid];
        if (u && u.sessions) {
            u.sessions = u.sessions.filter(s => s !== sessionId);
            this.db.updateUser(uid, { sessions: u.sessions });
        }

        const authPath = path.join(CONFIG.dbPath, `session_${uid}_${sessionId}`);
        try {
            if (fs.existsSync(authPath)) {
                fs.rmSync(authPath, { recursive: true, force: true });
            }
        } catch (e) {}
    },

    async startSession(userId, sessionId) {
        const uid = String(userId);
        const sessionKey = `${uid}_${sessionId}`;
        const authPath = path.join(CONFIG.dbPath, `session_${uid}_${sessionId}`);
        
        if (!fs.existsSync(authPath)) {
            fs.mkdirSync(authPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(authPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            logger: pino({ level: "silent" }),
            printQRInTerminal: false,
            mobile: false,
            auth: { 
                creds: state.creds, 
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })) 
            },
            browser: ["Firefox", "Firefox Web", "100.0.1"],
            connectTimeoutMs: 60000,
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false
        });

        if (!userSessions.has(uid)) userSessions.set(uid, new Map());
        userSessions.get(uid).set(sessionId, sock);

        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === "open") {
                sessionStatus.set(sessionKey, 'open');
            } else if (connection === "close") {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                if (statusCode !== DisconnectReason.loggedOut) {
                    sessionStatus.set(sessionKey, 'close');
                    await delay(5000);
                    this.startSession(userId, sessionId);
                } else {
                    sessionStatus.set(sessionKey, 'logout');
                    this.deleteSession(userId, sessionId);
                }
            }
        });

        sock.ev.on("creds.update", saveCreds);
        return sock;
    }
};
