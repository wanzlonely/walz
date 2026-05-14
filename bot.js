'use strict';

const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const sio = require('socket.io-client');

const BOT_TOKEN = '7673309476:AAEAg4kBjtBvCAKLAN3tBjNcuhJLYr7TdDg';
const OWNER_ID = '8062935882';
const HUB_URL = 'https://hub.orangecarrier.com';
const COOKIE_FILE = 'cookies.json';
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

let state = {};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function saveCookies(c) {
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(c, null, 2));
}

function loadCookies() {
  try { return JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8')); }
  catch { return {}; }
}

function parseCookieExport(raw) {
  const result = {};
  try {
    const arr = JSON.parse(raw.trim());
    for (const item of arr) if (item.name) result[item.name] = decodeURIComponent(item.value);
  } catch {
    raw.split(';').forEach(p => {
      const i = p.indexOf('=');
      if (i > 0) result[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
    });
  }
  return result;
}

async function tgRaw(method, data) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const req = https.request(`${TG_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

async function tgSend(chatId, text, markup) {
  const p = { chat_id: String(chatId), text, parse_mode: 'HTML', disable_web_page_preview: true };
  if (markup) p.reply_markup = markup;
  return await tgRaw('sendMessage', p);
}

async function doAddRangeHub(cid, rangeStr) {
  const cookies = loadCookies();
  const cookieHdr = `ivas_sms_session=${cookies['ivas_sms_session']}; XSRF-TOKEN=${cookies['XSRF-TOKEN'] || ''}`;
  const email = cookies.email;

  const socket = sio(HUB_URL, {
    extraHeaders: { Cookie: cookieHdr },
    transports: ['websocket'],
    reconnection: false,
  });

  let success = false;

  await new Promise(resolve => {
    const timeout = setTimeout(() => { socket.disconnect(); resolve(); }, 3000);

    socket.on('connect', async () => {
      await sleep(300);
      socket.emit('menu_selection', { selection: 'add_numbers', email, system: 'ivas', type: 'internal' });
      await sleep(500);
      socket.emit('form_submission', { formType: 'add_numbers', formData: { termination_string: rangeStr }, email, system: 'ivas', type: 'internal' });
      await sleep(1200);
      success = true;
      clearTimeout(timeout);
      socket.disconnect();
      resolve();
    });

    socket.on('connect_error', () => {
      clearTimeout(timeout);
      socket.disconnect();
      resolve();
    });
  });

  if (success) {
    await tgSend(cid, `<b>[ INJECTION SUCCESS ]</b>\n<code>──────────────────────────</code>\n<code>TARGET : ${esc(rangeStr)}</code>\n<code>STATUS : DELIVERED</code>\n<code>TIME   : ~2 SECONDS</code>\n<code>──────────────────────────</code>`);
  } else {
    await tgSend(cid, `<b>[ INJECTION FAILED ]</b>\n<code>──────────────────────────</code>\n<code>TARGET : ${esc(rangeStr)}</code>\n<code>ERR    : TIMEOUT/REJECTED</code>\n<code>──────────────────────────</code>`);
  }
}

function checkSetup() {
  const c = loadCookies();
  if (!c['ivas_sms_session']) return 'cookie';
  if (!c.email) return 'email';
  return 'ready';
}

function getMenu() {
  const status = checkSetup();
  if (status === 'cookie') {
    return `<b>[ SYSTEM SETUP 1/2 ]</b>\n<code>──────────────────────────</code>\n<code>STATUS : MISSING COOKIE</code>\n<code>──────────────────────────</code>\nKirimkan data JSON Cookie Anda.`;
  } else if (status === 'email') {
    return `<b>[ SYSTEM SETUP 2/2 ]</b>\n<code>──────────────────────────</code>\n<code>STATUS : MISSING EMAIL</code>\n<code>──────────────────────────</code>\nKirimkan Email akun iVAS Anda.`;
  } else {
    return `<b>[ NEXUS CORE READY ]</b>\n<code>──────────────────────────</code>\n<code>SYS    : ONLINE</code>\n<code>MODULE : ADD RANGE</code>\n<code>──────────────────────────</code>\nKirimkan Nama Range untuk diinjeksi.`;
  }
}

async function handleMessage(msg) {
  const cid = msg.chat.id;
  const text = (msg.text || '').trim();

  if (String(cid) !== String(OWNER_ID)) return;

  if (text === '/start' || text === '/menu') {
    state[cid] = checkSetup();
    await tgSend(cid, getMenu());
    return;
  }

  const currentStep = checkSetup();

  if (currentStep === 'cookie' || state[cid] === 'cookie') {
    const cookies = parseCookieExport(text);
    if (cookies['ivas_sms_session']) {
      saveCookies(cookies);
      state[cid] = 'email';
      await tgSend(cid, `<b>[ AUTHENTICATION OK ]</b>\n<code>──────────────────────────</code>\n<code>COOKIE : SAVED</code>\n<code>──────────────────────────</code>\nLanjutkan: Kirimkan Email akun.`);
    } else {
      await tgSend(cid, `<b>[ ERROR ]</b>\n<code>DATA INVALID OR CORRUPT</code>`);
    }
    return;
  }

  if (currentStep === 'email' || state[cid] === 'email') {
    if (text.includes('@') && text.includes('.')) {
      const c = loadCookies();
      c.email = text;
      saveCookies(c);
      state[cid] = 'ready';
      await tgSend(cid, getMenu());
    } else {
      await tgSend(cid, `<b>[ ERROR ]</b>\n<code>FORMAT EMAIL INVALID</code>`);
    }
    return;
  }

  if (currentStep === 'ready' || state[cid] === 'ready') {
    await tgSend(cid, `<b>[ EXECUTING... ]</b>\n<code>──────────────────────────</code>\n<code>TARGET : ${esc(text)}</code>\n<code>──────────────────────────</code>`);
    await doAddRangeHub(cid, text);
    return;
  }
}

async function main() {
  let offset = 0;
  while (true) {
    try {
      const res = await new Promise(resolve => {
        const req = https.request(`${TG_API}/getUpdates?timeout=30&offset=${offset}`, { method: 'GET', timeout: 35000 }, r => {
          let chunks = '';
          r.on('data', c => chunks += c);
          r.on('end', () => { try { resolve(JSON.parse(chunks)); } catch { resolve(null); } });
        });
        req.on('error', () => resolve(null));
        req.end();
      });

      if (res && res.result) {
        for (const upd of res.result) {
          offset = upd.update_id + 1;
          if (upd.message) handleMessage(upd.message).catch(() => {});
        }
      }
    } catch {
      await sleep(2000);
    }
  }
}

process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});

main();
