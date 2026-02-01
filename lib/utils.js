import axios from 'axios';
import XLSX from 'xlsx';
import { CONFIG } from '../config.js';

export const MENUS = {
    mainAdmin: {
        inline_keyboard: [
            [{ text: '🚀 Perbaiki WA', callback_data: 'menu_fix' }, { text: '🔎 Cek Bio', callback_data: 'menu_check' }],
            [{ text: '👥 User Manager', callback_data: 'menu_users' }, { text: '⚙️ Pengaturan', callback_data: 'menu_settings' }],
            [{ text: '👑 Panel Owner', callback_data: 'menu_owner' }, { text: '📂 Konversi', callback_data: 'menu_convert' }]
        ]
    },
    mainUser: {
        inline_keyboard: [
            [{ text: '🚀 Perbaiki WA', callback_data: 'menu_fix' }, { text: '🔎 Cek Bio', callback_data: 'menu_check' }],
            [{ text: '⚙️ Pengaturan', callback_data: 'menu_settings' }, { text: '📂 Konversi', callback_data: 'menu_convert' }],
            [{ text: '💎 Beli Premium', callback_data: 'buy_access' }, { text: '👤 Profil Saya', callback_data: 'my_profile' }]
        ]
    },
    fixMenu: {
        inline_keyboard: [
            [{ text: '🔧 Fix Login (Merah)', callback_data: 'act_fix_red' }],
            [{ text: '🚫 Unban Spam', callback_data: 'act_unban_spam' }, { text: '⛔ Unban Permanen', callback_data: 'act_unban_perm' }],
            [{ text: '🔙 Kembali', callback_data: 'back_home' }]
        ]
    },
    settingsAdmin: {
        inline_keyboard: [
            [{ text: '📧 Kelola Email', callback_data: 'menu_email' }, { text: '📱 Kelola Perangkat', callback_data: 'menu_device' }],
            [{ text: '🔙 Kembali', callback_data: 'back_home' }]
        ]
    },
    settingsUser: {
        inline_keyboard: [
            [{ text: '📱 Kelola Perangkat', callback_data: 'menu_device' }],
            [{ text: '🔙 Kembali', callback_data: 'back_home' }]
        ]
    },
    deviceMenu: {
        inline_keyboard: [
            [{ text: '➕ Tambah Nomor', callback_data: 'dev_add' }, { text: '🗑️ Hapus Sesi', callback_data: 'dev_del' }],
            [{ text: '📋 List Sesi', callback_data: 'dev_list' }],
            [{ text: '🔙 Kembali', callback_data: 'menu_settings' }]
        ]
    },
    emailMenu: {
        inline_keyboard: [
            [{ text: '➕ Tambah Email', callback_data: 'email_add' }, { text: '📋 List Email', callback_data: 'email_list' }],
            [{ text: '🗑️ Hapus Email', callback_data: 'email_del' }, { text: '🔙 Kembali', callback_data: 'menu_settings' }]
        ]
    },
    userMenu: {
        inline_keyboard: [
            [{ text: '➕ Tambah Durasi', callback_data: 'user_add_time' }, { text: '➖ Potong Durasi', callback_data: 'user_cut_time' }],
            [{ text: '📋 Daftar User', callback_data: 'user_list' }, { text: '🔙 Kembali', callback_data: 'back_home' }]
        ]
    },
    ownerMenu: {
        inline_keyboard: [
            [{ text: '➕ Admin', callback_data: 'own_add_admin' }, { text: '➖ Admin', callback_data: 'own_del_admin' }],
            [{ text: '📢 Broadcast', callback_data: 'own_bc' }, { text: '📝 Set Template', callback_data: 'own_template_menu' }],
            [{ text: '📦 Backup Full', callback_data: 'own_backup' }, { text: '🚧 Maintenance', callback_data: 'own_mt' }],
            [{ text: '🔙 Kembali', callback_data: 'back_home' }]
        ]
    },
    superAdminPanel: {
        inline_keyboard: [
            [{ text: '🔙 Kembali ke Panel Owner', callback_data: 'menu_owner' }]
        ]
    },
    templateMenu: {
        inline_keyboard: [
            [{ text: '🔧 Fix Merah', callback_data: 'tpl_fixred' }],
            [{ text: '🚫 Unban Spam', callback_data: 'tpl_spam' }],
            [{ text: '⛔ Unban Permanen', callback_data: 'tpl_permanen' }],
            [{ text: '🔙 Kembali', callback_data: 'menu_owner' }]
        ]
    },
    backOnly: {
        inline_keyboard: [[{ text: '🔙 Batalkan', callback_data: 'back_home' }]]
    },
    unbanType: {
        inline_keyboard: [
            [{ text: '🚫 Banding Spam', callback_data: 'act_unban_spam' }],
            [{ text: '⛔ Banding Permanen', callback_data: 'act_unban_perm' }],
            [{ text: '🔙 Kembali', callback_data: 'menu_fix' }]
        ]
    },
    verify: {
        inline_keyboard: [
            [{ text: '🚀 Gabung Grup Resmi', url: CONFIG.groupLink }],
            [{ text: '✅ Saya Sudah Join', callback_data: 'verify_join' }]
        ]
    }
};

export const Validator = {
    email: (text) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(text.trim()),
    appPass: (text) => text.replace(/\s/g, '').length === 16,
    number: (text) => /^\d{10,15}$/.test(text.replace(/\D/g, '')),
    days: (text) => /^\d+$/.test(text.trim()) && parseInt(text) > 0
};

export function formatTimeLeft(expiredTime) {
    if (!expiredTime) return "TIDAK AKTIF";
    if (expiredTime > 9000000000000) return "♾️ PERMANENT";
    const diff = expiredTime - Date.now();
    if (diff <= 0) return "HABIS / EXPIRED";
    const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${d} Hari`;
}

export function formatDate(ms) {
    if (!ms) return "-";
    if (ms > 9000000000000) return "Permanent";
    return new Date(ms).toLocaleDateString('id-ID');
}

export function maskEmail(email) {
    const parts = email.split('@');
    if (parts.length !== 2) return 'xxxx';
    const [local, domain] = parts;
    return local.substring(0, 2) + '•••@' + domain;
}

export function createProgressBar(current, max) {
    const totalBars = 10;
    let percentage = (current / max);
    if (percentage > 1) percentage = 1;
    let filled = Math.round(percentage * totalBars);
    if (filled < 0) filled = 0;
    if (filled > totalBars) filled = totalBars;
    const empty = totalBars - filled;
    return '▰'.repeat(filled) + '▱'.repeat(empty);
}

const COUNTRY_MAP = {
    '1': '🇺🇸 USA / 🇨🇦 Canada', '7': '🇷🇺 Russia / 🇰🇿 Kazakhstan', '20': '🇪🇬 Egypt',
    '27': '🇿🇦 South Africa', '30': '🇬🇷 Greece', '31': '🇳🇱 Netherlands',
    '32': '🇧🇪 Belgium', '33': '🇫🇷 France', '34': '🇪🇸 Spain', '36': '🇭🇺 Hungary',
    '39': '🇮🇹 Italy', '40': '🇷🇴 Romania', '41': '🇨🇭 Switzerland', '43': '🇦🇹 Austria',
    '44': '🇬🇧 UK', '45': '🇩🇰 Denmark', '46': '🇸🇪 Sweden', '47': '🇳🇴 Norway',
    '48': '🇵🇱 Poland', '49': '🇩🇪 Germany', '51': '🇵🇪 Peru', '52': '🇲🇽 Mexico',
    '53': '🇨🇺 Cuba', '54': '🇦🇷 Argentina', '55': '🇧🇷 Brazil', '56': '🇨🇱 Chile',
    '57': '🇨🇴 Colombia', '58': '🇻🇪 Venezuela', '60': '🇲🇾 Malaysia', '61': '🇦🇺 Australia',
    '62': '🇮🇩 Indonesia', '63': '🇵🇭 Philippines', '64': '🇳🇿 New Zealand', '65': '🇸🇬 Singapore',
    '66': '🇹🇭 Thailand', '81': '🇯🇵 Japan', '82': '🇰🇷 South Korea', '84': '🇻🇳 Vietnam',
    '86': '🇨🇳 China', '90': '🇹🇷 Turkey', '91': '🇮🇳 India', '92': '🇵🇰 Pakistan',
    '93': '🇦🇫 Afghanistan', '94': '🇱🇰 Sri Lanka', '95': '🇲🇲 Myanmar', '98': '🇮🇷 Iran',
    '211': '🇸🇸 South Sudan', '212': '🇲🇦 Morocco', '213': '🇩🇿 Algeria', '216': '🇹🇳 Tunisia',
    '218': '🇱🇾 Libya', '220': '🇬🇲 Gambia', '221': '🇸🇳 Senegal', '222': '🇲🇷 Mauritania',
    '223': '🇲🇱 Mali', '224': '🇬🇳 Guinea', '225': '🇨🇮 Côte d\'Ivoire', '226': '🇧🇫 Burkina Faso',
    '227': '🇳🇪 Niger', '228': '🇹🇬 Togo', '229': '🇧🇯 Benin', '230': '🇲🇺 Mauritius',
    '231': '🇱🇷 Liberia', '232': '🇸🇱 Sierra Leone', '233': '🇬🇭 Ghana', '234': '🇳🇬 Nigeria',
    '235': '🇹🇩 Chad', '236': '🇨🇫 CAR', '237': '🇨🇲 Cameroon', '238': '🇨🇻 Cape Verde',
    '239': '🇸🇹 Sao Tome', '240': '🇬🇶 Equatorial Guinea', '241': '🇬🇦 Gabon', '242': '🇨🇬 Congo',
    '243': '🇨🇩 DR Congo', '244': '🇦🇴 Angola', '245': '🇬🇼 Guinea-Bissau', '246': '🇮🇴 Diego Garcia',
    '247': '🇦🇨 Ascension', '248': '🇸🇨 Seychelles', '249': '🇸🇩 Sudan', '250': '🇷🇼 Rwanda',
    '251': '🇪🇹 Ethiopia', '252': '🇸🇴 Somalia', '253': '🇩🇯 Djibouti', '254': '🇰🇪 Kenya',
    '255': '🇹🇿 Tanzania', '256': '🇺🇬 Uganda', '257': '🇧🇮 Burundi', '258': '🇲🇿 Mozambique',
    '260': '🇿🇲 Zambia', '261': '🇲🇬 Madagascar', '262': '🇷🇪 Reunion', '263': '🇿🇼 Zimbabwe',
    '264': '🇳🇦 Namibia', '265': '🇲🇼 Malawi', '266': '🇱🇸 Lesotho', '267': '🇧🇼 Botswana',
    '268': '🇸🇿 Eswatini', '269': '🇰🇲 Comoros', '290': '🇸🇭 Saint Helena', '291': '🇪🇷 Eritrea',
    '297': '🇦🇼 Aruba', '298': '🇫🇴 Faroe Islands', '299': '🇬🇱 Greenland', '350': '🇬🇮 Gibraltar',
    '351': '🇵🇹 Portugal', '352': '🇱🇺 Luxembourg', '353': '🇮🇪 Ireland', '354': '🇮🇸 Iceland',
    '355': '🇦🇱 Albania', '356': '🇲🇹 Malta', '357': '🇨🇾 Cyprus', '358': '🇫🇮 Finland',
    '359': '🇧🇬 Bulgaria', '370': '🇱🇹 Lithuania', '371': '🇱🇻 Latvia', '372': '🇪🇪 Estonia',
    '373': '🇲🇩 Moldova', '374': '🇦🇲 Armenia', '375': '🇧🇾 Belarus', '376': '🇦🇩 Andorra',
    '377': '🇲🇨 Monaco', '378': '🇸🇲 San Marino', '379': '🇻🇦 Vatican City', '380': '🇺🇦 Ukraine',
    '381': '🇷🇸 Serbia', '382': '🇲🇪 Montenegro', '383': '🇽🇰 Kosovo', '385': '🇭🇷 Croatia',
    '386': '🇸🇮 Slovenia', '387': '🇧🇦 Bosnia', '389': '🇲🇰 Macedonia', '420': '🇨🇿 Czechia',
    '421': '🇸🇰 Slovakia', '423': '🇱🇮 Liechtenstein', '500': '🇫🇰 Falkland Islands', '501': '🇧🇿 Belize',
    '502': '🇬🇹 Guatemala', '503': '🇸🇻 El Salvador', '504': '🇭🇳 Honduras', '505': '🇳🇮 Nicaragua',
    '506': '🇨🇷 Costa Rica', '507': '🇵🇦 Panama', '508': '🇵🇲 St. Pierre', '509': '🇭🇹 Haiti',
    '590': '🇬🇵 Guadeloupe', '591': '🇧🇴 Bolivia', '592': '🇬🇾 Guyana', '593': '🇪🇨 Ecuador',
    '594': '🇬🇫 French Guiana', '595': '🇵🇾 Paraguay', '596': '🇲🇶 Martinique', '597': '🇸🇷 Suriname',
    '598': '🇺🇾 Uruguay', '599': '🇨🇼 Curacao', '670': '🇹🇱 Timor-Leste', '672': '🇳🇫 Norfolk Island',
    '673': '🇧🇳 Brunei', '674': '🇳🇷 Nauru', '675': '🇵🇬 PNG', '676': '🇹🇴 Tonga',
    '677': '🇸🇧 Solomon Islands', '678': '🇻🇺 Vanuatu', '679': '🇫🇯 Fiji', '680': '🇵🇼 Palau',
    '681': '🇼🇫 Wallis & Futuna', '682': '🇨🇰 Cook Islands', '683': '🇳🇺 Niue', '685': '🇼🇸 Samoa',
    '686': '🇰🇮 Kiribati', '687': '🇳🇨 New Caledonia', '688': '🇹🇻 Tuvalu', '689': '🇵🇫 French Polynesia',
    '690': '🇹🇰 Tokelau', '691': '🇫🇲 Micronesia', '692': '🇲🇭 Marshall Islands', '850': '🇰🇵 North Korea',
    '852': '🇭🇰 Hong Kong', '853': '🇲🇴 Macau', '855': '🇰🇭 Cambodia', '856': '🇱🇦 Laos',
    '880': '🇧🇩 Bangladesh', '886': '🇹🇼 Taiwan', '960': '🇲🇻 Maldives', '961': '🇱🇧 Lebanon',
    '962': '🇯🇴 Jordan', '963': '🇸🇾 Syria', '964': '🇮🇶 Iraq', '965': '🇰🇼 Kuwait',
    '966': '🇸🇦 Saudi Arabia', '967': '🇾🇪 Yemen', '968': '🇴🇲 Oman', '970': '🇵🇸 Palestine',
    '971': '🇦🇪 UAE', '972': '🇮🇱 Israel', '973': '🇧🇭 Bahrain', '974': '🇶🇦 Qatar',
    '975': '🇧🇹 Bhutan', '976': '🇲🇳 Mongolia', '977': '🇳🇵 Nepal', '992': '🇹🇯 Tajikistan',
    '993': '🇹🇲 Turkmenistan', '994': '🇦🇿 Azerbaijan', '995': '🇬🇪 Georgia', '996': '🇰🇬 Kyrgyzstan',
    '998': '🇺🇿 Uzbekistan', '1242': '🇧🇸 Bahamas', '1246': '🇧🇧 Barbados', '1264': '🇦🇮 Anguilla',
    '1268': '🇦🇬 Antigua', '1284': '🇻🇬 BVI', '1345': '🇰🇾 Cayman', '1441': '🇧🇲 Bermuda',
    '1473': '🇬🇩 Grenada', '1649': '🇹🇨 TCI', '1664': '🇲🇸 Montserrat', '1721': '🇸🇽 Sint Maarten',
    '1758': '🇱🇨 St. Lucia', '1767': '🇩🇲 Dominica', '1784': '🇻🇨 SVG', '1849': '🇩🇴 Dominican Rep.',
    '1868': '🇹🇹 Trinidad', '1869': '🇰🇳 St. Kitts', '1876': '🇯🇲 Jamaica'
};

export function detectCountry(number) {
    const n = number.toString().replace(/\D/g, '');
    for (let i = 4; i >= 1; i--) {
        const prefix = n.substring(0, i);
        if (COUNTRY_MAP[prefix]) {
            return COUNTRY_MAP[prefix];
        }
    }
    return '🏳️ Unknown/Intl';
}

export const FileHandler = {
    async process(url, fileName) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            const ext = fileName.split('.').pop().toLowerCase();

            if (ext === 'txt') {
                const text = buffer.toString('utf-8');
                return text.match(/\d{8,15}/g) || [];
            }
            else if (ext === 'xlsx' || ext === 'xls') {
                const wb = XLSX.read(buffer, { type: 'buffer' });
                let nums = [];
                wb.SheetNames.forEach(name => {
                    const sheet = wb.Sheets[name];
                    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    json.flat().forEach(cell => {
                        if (cell) {
                            const str = String(cell).replace(/\D/g, '');
                            if (str.length > 5) nums.push(str);
                        }
                    });
                });
                return nums;
            }
            return [];
        } catch (e) {
            throw new Error('Gagal mendownload atau membaca file.');
        }
    }
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
