import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';

export class Database {
    constructor() {
        if (!fs.existsSync(CONFIG.dbPath)) {
            fs.mkdirSync(CONFIG.dbPath, { recursive: true });
        }
        this.paths = {
            users: path.join(CONFIG.dbPath, 'users.json'),
            emails: path.join(CONFIG.dbPath, 'emails.json'),
            settings: path.join(CONFIG.dbPath, 'settings.json'),
            stats: path.join(CONFIG.dbPath, 'stats.json')
        };
        this.init();
    }

    init() {
        const defaultSettings = { owners: [CONFIG.ownerId], maintenance: false, templates: {}, lastReset: Date.now() };
        const defaultStats = { checked: 0, fixed: 0 };

        if (!fs.existsSync(this.paths.settings)) fs.writeFileSync(this.paths.settings, JSON.stringify(defaultSettings, null, 2));
        if (!fs.existsSync(this.paths.users)) fs.writeFileSync(this.paths.users, JSON.stringify({}, null, 2));
        if (!fs.existsSync(this.paths.emails)) fs.writeFileSync(this.paths.emails, JSON.stringify([], null, 2));
        if (!fs.existsSync(this.paths.stats)) fs.writeFileSync(this.paths.stats, JSON.stringify(defaultStats, null, 2));
        
        this.checkDailyReset();
    }

    checkDailyReset() {
        let s = this.settings;
        const last = new Date(s.lastReset || 0);
        const now = new Date();
        if (last.getDate() !== now.getDate() || last.getMonth() !== now.getMonth()) {
            let emails = this.emails;
            emails = emails.map(e => ({ ...e, count: 0 }));
            this.emails = emails;
            s.lastReset = Date.now();
            this.settings = s;
        }
    }

    get(key) { try { return JSON.parse(fs.readFileSync(this.paths[key], 'utf8')); } catch { return null; } }
    set(key, data) { fs.writeFileSync(this.paths[key], JSON.stringify(data, null, 2)); }

    get users() { return this.get('users') || {}; }
    get settings() { 
        let d = this.get('settings'); 
        if(!d.owners) d.owners = [CONFIG.ownerId]; 
        if(!d.templates) d.templates = {}; 
        return d; 
    }
    set settings(v) { this.set('settings', v); }
    get emails() { return this.get('emails') || []; }
    set emails(v) { this.set('emails', v); }
    get stats() { return this.get('stats') || { checked: 0, fixed: 0 }; }
    set stats(v) { this.set('stats', v); }

    isOwner(id) { return this.settings.owners.includes(String(id)) || String(id) === CONFIG.ownerId; }
    
    addOwner(id) {
        let s = this.settings;
        if (!s.owners.includes(String(id))) { s.owners.push(String(id)); this.settings = s; return true; }
        return false;
    }
    removeOwner(id) {
        if (String(id) === CONFIG.ownerId) return "SUPER_ADMIN";
        let s = this.settings;
        s.owners = s.owners.filter(o => o !== String(id));
        this.settings = s;
        return "SUCCESS";
    }

    updateUser(id, data) {
        const u = this.users;
        const uid = String(id);
        if (uid === CONFIG.ownerId) data.expired = 9999999999999;
        if (!u[uid]) u[uid] = { id: uid, username: 'User', joined: Date.now(), expired: 0 };
        u[uid] = { ...u[uid], ...data };
        this.set('users', u);
    }

    updateTemplate(type, subject, body) {
        let s = this.settings;
        if (!s.templates[type]) s.templates[type] = {};
        s.templates[type] = { subject, body };
        this.settings = s;
    }

    addEmail(email, pass) {
        let ePool = this.emails;
        if (ePool.length >= CONFIG.maxEmails) return "LIMIT_REACHED";
        if (ePool.find(e => e.email === email)) return "EXISTS";
        ePool.push({ email, pass, count: 0 });
        this.emails = ePool;
        return "SUCCESS";
    }

    removeEmail(index) {
        let ePool = this.emails;
        if (ePool.length <= index) return false;
        ePool.splice(index, 1);
        this.emails = ePool;
        return true;
    }

    hasAvailableEmail() {
        return this.emails.some(e => e.count < CONFIG.maxCountPerEmail);
    }

    updateStats(key, val) {
        const s = this.stats;
        s[key] += val;
        this.stats = s;
    }
}
