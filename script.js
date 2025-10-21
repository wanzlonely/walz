const GAMES = [
    // ... (Data GAMES kamu tetap sama) ...
    { key: "free-fire", name: "Free Fire", publisher: "Garena", img: "https://i.supaimg.com/023005b8-5541-4175-8563-072978e05973.jpg", url: "game.html?key=free-fire", needsServerId: false },
    { key: "mobile-legends", name: "Mobile Legends", publisher: "Moonton", img: "https://i.supaimg.com/3272ce04-c4a0-4025-8d8a-b2723a2f2267.jpg", url: "game.html?key=mobile-legends", needsServerId: true },
    { key: "honor-of-kings", name: "Honor of Kings", publisher: "Level Infinite", img: "https://i.supaimg.com/98bfce2d-9b90-40be-8f2e-b42ab896dc3d.jpg", url: "game.html?key=honor-of-kings", needsServerId: true },
    { key: "genshin-impact", name: "Genshin Impact", publisher: "Hoyoverse", img: "https://i.supaimg.com/872628e9-c5f6-46f5-b5cc-8c8f3e8766c7.jpg", url: "game.html?key=genshin-impact", needsServerId: true },
    { key: "roblox", name: "Roblox", publisher: "Roblox Corporation", img: "https://i.supaimg.com/c8d8f1c7-b02c-4643-a6e5-63a6487d622c.jpg", url: "game.html?key=roblox", needsServerId: false },
    { key: "super-sus", name: "Super Sus", publisher: "Super Sus", img: "https://files.catbox.moe/j61uny.jpg", url: "game.html?key=super-sus", needsServerId: true },
    { key: "coc", name: "Clash of Clans", publisher: "Supercell", img: "https://files.catbox.moe/6aia0n.jpg", url: "game.html?key=coc", needsServerId: false },
    { key: "blood-strike", name: "Blood Strike", publisher: "NetEase", img: "https://files.catbox.moe/3y066i.jpg", url: "game.html?key=blood-strike", needsServerId: false },
    { key: "pubg", name: "PUBG Mobile", publisher: "Semua Region", img: "https://files.catbox.moe/tatuo9.jpg", url: "game.html?key=pubg", needsServerId: false },
    { key: "garena-delta", name: "Garena Delta Force", publisher: "Garena Delta...", img: "https://i.supaimg.com/51600c75-7f50-440c-b363-7b739a5bd976.png", url: "game.html?key=garena-delta", needsServerId: false },
    { key: "garena-undawn", name: "Garena Undawn", publisher: "Garena", img: "https://i.supaimg.com/41450b00-c089-49c9-a6f2-a1d37b08f1cd.png", url: "game.html?key=garena-undawn", needsServerId: false },
    { key: "valorant", name: "Valorant", publisher: "Riot Games", img: "https://i.supaimg.com/6f1b6502-92e1-4c94-8246-2ff54e08b93d.png", url: "game.html?key=valorant", needsServerId: false },
    { key: "call-of-duty", name: "Call Of Duty", publisher: "Activision", img: "https://i.supaimg.com/f7665c44-d005-475b-adbb-3b685aaf1415.webp", url: "game.html?key=call-of-duty", needsServerId: false },
    { key: "eggy-party", name: "Eggy Party", publisher: "NetEase Games", img: "https://i.supaimg.com/7e8f84ad-9663-4028-9fff-6bbdd6b72f0b.jpg", url: "game.html?key=eggy-party", needsServerId: false },
    { key: "magic-ches-gogo", name: "Magic Ches Gogo", publisher: "Vizta Games", img: "https://files.catbox.moe/bbxhbo.jpg", url: "game.html?key=magic-ches-gogo", needsServerId: true },
];

const PAYMENTS = [
    // ... (Data PAYMENTS kamu tetap sama) ...
    { id: "qris", name: "QRIS", img: "https://i.supaimg.com/7b5fe49a-a708-4a05-8b00-9865481e0e13.jpg", qr: "https://files.catbox.moe/pa0iwo.png" },
    { id: "krom", name: "Bank Krom", img: "https://i.supaimg.com/20eaef7a-3a63-4be3-a507-175348ab41de.jpg", number: "770072009565", holder: "Walzshop ID" },
    { id: "dana", name: "Dana", img: "https://i.supaimg.com/e4a887fd-41fd-4075-9802-8b65bb52d1cb.jpg", number: "083139243389", holder: "Anom" },
    { id: "gopay", name: "Gopay", img: "https://i.supaimg.com/104ae434-3bb9-4071-a946-73b301a5ba29.jpg", number: "082298902274", holder: "Anom" }
];

const PRODUCTS = {
    // ... (Data PRODUCTS kamu tetap sama) ...
    "free-fire": [
        { id: "ff-5", label: "5 Diamonds", price: 901 },
        { id: "ff-12", label: "12 Diamonds", price: 1802 },
        { id: "ff-50", label: "50 Diamonds", price: 7207 },
        { id: "ff-70", label: "70 Diamonds", price: 9009 },
        { id: "ff-140", label: "140 Diamonds", price: 18018 },
        { id: "ff-355", label: "355 Diamonds", price: 45045 },
        { id: "ff-720", label: "720 Diamonds", price: 90090 },
        { id: "ff-1450", label: "1450 Diamonds", price: 180180 },
        { id: "ff-2180", label: "2180 Diamonds", price: 270270 },
        { id: "ff-3640", label: "3640 Diamonds", price: 450450 },
        { id: "ff-mw", label: "Membership Mingguan", price: 30500, badges: ["member"] },
        { id: "ff-mb", label: "Membership Bulanan", price: 90000, badges: ["member"] },
        { id: "ff-lvl6", label: "Level Up Pass Lv.6", price: 5500, badges: ["levelup"] },
        { id: "ff-lvl10", label: "Level Up Pass Lv.10", price: 8800, badges: ["levelup"] },
        { id: "ff-lvl15", label: "Level Up Pass Lv.15", price: 8800, badges: ["levelup"] },
        { id: "ff-lvl20", label: "Level Up Pass Lv.20", price: 8800, badges: ["levelup"] },
        { id: "ff-booyah", label: "BooYah Pass", price: 50000, badges: ["pass"] },
    ],
    "mobile-legends": [
        { id: "ml-3", label: "3 Diamonds", price: 1171 },
        { id: "ml-5", label: "5 Diamonds", price: 1423 },
        { id: "ml-12", label: "12 Diamonds", price: 3323 },
        { id: "ml-19", label: "19 Diamonds", price: 5223 },
        { id: "ml-28", label: "28 Diamonds", price: 7600 },
        { id: "ml-44", label: "44 Diamonds", price: 11400 },
        { id: "ml-59", label: "59 Diamonds", price: 15200 },
        { id: "ml-85", label: "85 Diamonds", price: 21850 },
        { id: "ml-170", label: "170 Diamonds", price: 43700 },
        { id: "ml-240", label: "240 Diamonds", price: 61750 },
        { id: "ml-296", label: "296 Diamonds", price: 76000 },
        { id: "ml-408", label: "408 Diamonds", price: 104500 },
        { id: "ml-568", label: "568 Diamonds", price: 142500 },
        { id: "ml-875", label: "875 Diamonds", price: 218500 },
        { id: "ml-2010", label: "2010 Diamonds", price: 475000 },
        { id: "ml-4830", label: "4830 Diamonds", price: 1140000 },
        { id: "ml-wdp", label: "Weekly Diamond Pass", price: 28000, badges: ["weekly"] },
        { id: "ml-twilight", label: "Twilight Pass", price: 150000, badges: ["pass"] },
    ],
    // ... (Sisa data PRODUCTS kamu tetap sama) ...
    "pulsa": {
        "telkomsel": [
            { id: "tel-5k", label: "Pulsa Rp 5.000", price: 6500 },
            { id: "tel-10k", label: "Pulsa Rp 10.000", price: 11500 },
            { id: "tel-20k", label: "Pulsa Rp 20.000", price: 21500 },
            { id: "tel-50k", label: "Pulsa Rp 50.000", price: 51500 },
            { id: "tel-100k", label: "Pulsa Rp 100.000", price: 101500 }
        ],
        "indosat": [
            { id: "ind-5k", label: "Pulsa Rp 5.000", price: 6800 },
            { id: "ind-10k", label: "Pulsa Rp 10.000", price: 11800 },
            { id: "ind-20k", label: "Pulsa Rp 20.000", price: 21800 },
            { id: "ind-50k", label: "Pulsa Rp 50.000", price: 51800 },
            { id: "ind-100k", label: "Pulsa Rp 100.000", price: 101800 }
        ],
        "xl": [
            { id: "xl-5k", label: "Pulsa Rp 5.000", price: 6700 },
            { id: "xl-10k", label: "Pulsa Rp 10.000", price: 11700 },
            { id: "xl-20k", label: "Pulsa Rp 20.000", price: 21700 },
            { id: "xl-50k", label: "Pulsa Rp 50.000", price: 51700 },
            { id: "xl-100k", label: "Pulsa Rp 100.000", price: 101700 }
        ],
        "axis": [
            { id: "axis-5k", label: "Pulsa Rp 5.000", price: 6700 },
            { id: "axis-10k", label: "Pulsa Rp 10.000", price: 11700 },
            { id: "axis-20k", label: "Pulsa Rp 20.000", price: 21700 },
            { id: "axis-50k", label: "Pulsa Rp 50.000", price: 51700 },
            { id: "axis-100k", label: "Pulsa Rp 100.000", price: 101700 }
        ],
        "smartfren": [
            { id: "smf-5k", label: "Pulsa Rp 5.000", price: 6900 },
            { id: "smf-10k", label: "Pulsa Rp 10.000", price: 11900 },
            { id: "smf-20k", label: "Pulsa Rp 20.000", price: 21900 },
            { id: "smf-50k", label: "Pulsa Rp 50.000", price: 51900 },
            { id: "smf-100k", label: "Pulsa Rp 100.000", price: 101900 }
        ],
        "byu": [
            { id: "byu-5k", label: "Pulsa Rp 5.000", price: 6500 },
            { id: "byu-10k", label: "Pulsa Rp 10.000", price: 11500 },
            { id: "byu-20k", label: "Pulsa Rp 20.000", price: 21500 },
            { id: "byu-50k", label: "Pulsa Rp 50.000", price: 51500 },
            { id: "byu-100k", label: "Pulsa Rp 100.000", price: 101500 }
        ]
    },
    "panel": [
        { name: "Paket 1", price: 10000, desc: "1 CPU, 256 MB RAM, 1 GB Storage" },
        { name: "Paket 2", price: 20000, desc: "2 CPU, 512 MB RAM, 2 GB Storage" },
        { name: "Paket 3", price: 35000, desc: "4 CPU, 1 GB RAM, 5 GB Storage" }
    ]
};

// ========================
// Global State
// ========================
let isVoucherApplied = false;

// ========================
// Helper Functions
// ========================

/**
 * Format angka menjadi mata uang Rupiah (IDR).
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} - String Rupiah yang sudah diformat (e.g., "Rp 10.000").
 */
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

/**
 * UPGRADE: Fungsi debounce untuk membatasi frekuensi eksekusi fungsi.
 * Berguna untuk event 'input' agar tidak lag.
 * @param {Function} func - Fungsi yang ingin di-debounce.
 * @param {number} delay - Waktu tunggu (ms) sebelum eksekusi.
 * @returns {Function} - Fungsi baru yang sudah di-debounce.
 */
function debounce(func, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * UPGRADE: Fungsi notifikasi yang di-upgrade.
 * Sekarang bisa menampilkan beberapa notifikasi (stacking).
 * @param {string} message - Pesan notifikasi.
 * @param {boolean} [isSuccess=true] - Tipe notifikasi (sukses/gagal).
 */
function showNotification(message, isSuccess = true) {
    const container = document.querySelector('.notification-container');
    if (!container) return; // Jangan lakukan apa-apa jika container tidak ada

    const popup = document.createElement('div');
    popup.classList.add('notification-popup');

    const iconClass = isSuccess ? 'fa-check-circle' : 'fa-times-circle';
    const iconColor = isSuccess ? 'var(--selected-border)' : 'var(--price-color)';

    popup.innerHTML = `
        <i class="fas ${iconClass} icon" style="color:${iconColor};"></i>
        <span class="message">${message}</span>
    `;

    container.appendChild(popup); // UPGRADE: Append, jangan hapus innerHTML

    // Hapus popup setelah animasi fade-out selesai
    setTimeout(() => {
        popup.classList.add('fade-out');
        popup.addEventListener('animationend', () => {
            popup.remove();
        });
    }, 3000);
}

/**
 * Menyalin teks ke clipboard.
 * @param {string} text - Teks yang ingin disalin.
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Nomor berhasil disalin!', true);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        showNotification('Gagal menyalin nomor. Coba lagi.', false);
    });
}

/**
 * UPGRADE: Fungsi reusable untuk redirect ke WhatsApp.
 * @param {string} adminNumber - Nomor WA admin (format 62... ).
 * @param {string} message - Pesan yang ingin dikirim.
 */
function redirectToWhatsapp(adminNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${adminNumber}?text=${encodedMessage}`;
}

/**
 * Menandai kartu yang dipilih dan menghapus pilihan dari yang lain.
 * @param {HTMLElement} element - Elemen kartu (.option-card) yang diklik.
 */
function selectOption(element) {
    const parent = element.closest('.options-grid');
    if (!parent) return;

    const siblings = parent.querySelectorAll(`.option-card`);
    siblings.forEach(sibling => {
        sibling.classList.remove('selected');
    });
    element.classList.add('selected');

    // Update summary di halaman yang membutuhkannya
    if (document.getElementById('topup-form')) {
        updateSummary();
    } else if (document.getElementById('topup-pulsa-form')) {
        updatePulsaSummary();
    }
}

/**
 * UPGRADE: Handler untuk event delegation pada grid pilihan.
 * @param {Event} event - Event klik.
 */
function handleGridSelection(event) {
    const selectedCard = event.target.closest('.option-card');
    if (!selectedCard) return; // Klik di luar kartu
    selectOption(selectedCard);
}

// ========================
// Logika Halaman Index
// ========================

/**
 * Merender daftar kartu game ke dalam grid.
 * @param {Array} gamesToRender - Array objek game yang akan dirender.
 */
function renderGameCards(gamesToRender) {
    const gameListContainer = document.getElementById('game-list');
    if (!gameListContainer) return;

    gameListContainer.innerHTML = '';
    if (gamesToRender.length === 0) {
        gameListContainer.innerHTML = '<p class="no-results-message" style="text-align:center; color:var(--text-light);">Game tidak ditemukan.</p>';
        return;
    }
    
    gamesToRender.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add("game-card-custom");
        gameCard.innerHTML = `
            <a href="${game.url}">
                <img src="${game.img}" alt="${game.name}" class="game-card-img">
                <div class="game-card-content-custom">
                    <h3>${game.name}</h3>
                    <p>${game.publisher}</p>
                </div>
            </a>
        `;
        gameListContainer.appendChild(gameCard);
    });
}

/**
 * Fungsi pencarian game (dibatasi oleh debounce).
 */
function liveSearchGames() {
    const searchInput = document.getElementById('game-search');
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredGames = GAMES.filter(game => {
        return game.name.toLowerCase().includes(searchTerm) ||
               game.publisher.toLowerCase().includes(searchTerm);
    });
    
    renderGameCards(filteredGames);
}

// ========================
// Logika Halaman Game
// ========================

/**
 * UPGRADE: Fungsi reusable untuk render metode pembayaran.
 * @param {string} containerId - ID elemen kontainer (e.g., "payment-list").
 */
function renderPaymentMethods(containerId) {
    const paymentListContainer = document.getElementById(containerId);
    if (!paymentListContainer) return;

    paymentListContainer.innerHTML = '';
    PAYMENTS.forEach(payment => {
        const paymentDiv = document.createElement("div");
        paymentDiv.classList.add("option-card", "payment");
        paymentDiv.setAttribute('data-id', payment.id);
        paymentDiv.innerHTML = `
            <img src="${payment.img}" alt="${payment.name}">
            <div class="label">${payment.name}</div>
        `;
        // UPGRADE: onclick dihapus, diganti event delegation
        paymentListContainer.appendChild(paymentDiv);
    });
}

/**
 * Merender daftar produk (diamond, dll) untuk game tertentu.
 * @param {string} gameKey - Key dari game (e.g., "free-fire").
 */
function renderProducts(gameKey) {
    const productListContainer = document.getElementById("product-list");
    if (!productListContainer) return;

    productListContainer.innerHTML = '';
    const products = PRODUCTS[gameKey];
    const voucherDiscount = 100;

    if (products) {
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("option-card");
            productDiv.setAttribute('data-id', product.id);

            let badgeHtml = '';
            if (product.badges && product.badges.length > 0) {
                const badgeText = product.badges[0].charAt(0).toUpperCase() + product.badges[0].slice(1);
                badgeHtml = `<span class="special-badge">${badgeText}</span>`;
            }

            // UPGRADE: Baca harga asli dari constant, jangan dari state
            const originalPrice = PRODUCTS[gameKey].find(p => p.id === product.id).price;
            const currentPrice = isVoucherApplied ? Math.max(0, originalPrice - voucherDiscount) : originalPrice;

            productDiv.innerHTML = `
                ${badgeHtml}
                <i class="fas fa-gem icon"></i>
                <div class="label">${product.label}</div>
                <div class="price-group">
                    ${isVoucherApplied ? `<div class="original-price">${formatRupiah(originalPrice)}</div>` : ''}
                    <div class="price">${formatRupiah(currentPrice)}</div>
                </div>
            `;
            // UPGRADE: onclick dihapus, diganti event delegation
            productListContainer.appendChild(productDiv);
        });
    }
}

/**
 * Memperbarui kartu ringkasan pesanan di halaman game.
 */
function updateSummary() {
    const selectedProductCard = document.querySelector('#product-list .option-card.selected');
    const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
    const summaryCard = document.getElementById('summary-card');
    const confirmButton = document.getElementById('confirm-button');
    const userIdInput = document.getElementById('user-id');
    const whatsappInput = document.getElementById('whatsapp-number');
    const serverIdInput = document.getElementById('server-id');

    // UPGRADE: Ambil gameKey dari URLSearchParams
    const gameKey = new URLSearchParams(window.location.search).get('key');
    const game = GAMES.find(g => g.key === gameKey);

    // UPGRADE: Validasi WA pakai regex
    const phoneRegex = /^08[0-9]{8,11}$/; // 10-13 digit, mulai 08
    const isProductSelected = !!selectedProductCard;
    const isPaymentSelected = !!selectedPaymentCard;
    const isIdValid = userIdInput && userIdInput.value.length > 0;
    const isWhatsappValid = whatsappInput && phoneRegex.test(whatsappInput.value);

    let isServerIdValid = true;
    if (game && game.needsServerId) {
        isServerIdValid = serverIdInput && serverIdInput.value.length > 0;
    }

    if (isProductSelected && isPaymentSelected && isIdValid && isWhatsappValid && isServerIdValid) {
        summaryCard.style.display = 'block';
        confirmButton.disabled = false;

        const productId = selectedProductCard.dataset.id;
        // UPGRADE: Selalu baca harga asli dari PRODUCTS
        const product = PRODUCTS[gameKey].find(p => p.id === productId);
        const voucherDiscount = 100;
        const finalPrice = isVoucherApplied ? Math.max(0, product.price - voucherDiscount) : product.price;

        document.getElementById('summary-product-details').innerHTML = `
            <i class="fas fa-gem" style="color:var(--accent-color);"></i>
            <span class="product-text">${product.label}</span>
        `;
        document.getElementById('summary-price').innerText = formatRupiah(finalPrice);
    } else {
        summaryCard.style.display = 'none';
        confirmButton.disabled = true;
    }
}

/**
 * Setup untuk halaman detail game.
 */
function setupGamePage() {
    // UPGRADE: Gunakan URLSearchParams, hapus getUrlParameter
    const params = new URLSearchParams(window.location.search);
    const gameKey = params.get('key');
    const game = GAMES.find(g => g.key === gameKey);

    // Cek elemen penting
    const productListContainer = document.getElementById("product-list");
    const paymentListContainer = document.getElementById("payment-list");
    const gameInfoHeader = document.getElementById("game-info-header");
    const serverIdContainer = document.getElementById("server-id-container");
    const promoCodeInput = document.getElementById('promo-code');

    if (!game || !productListContainer || !paymentListContainer || !gameInfoHeader) {
        window.location.href = 'index.html'; // Redirect jika data tidak valid
        return;
    }

    // Render info header game
    gameInfoHeader.innerHTML = `
        <img src="${game.img}" alt="${game.name}" class="game-img">
        <h2>${game.name}</h2>
        <div class="game-info-details">
            <div class="game-detail-item">
                <i class="fas fa-shield-alt"></i>
                <p>Pembayaran Aman</p>
            </div>
            <div class="game-detail-item">
                <i class="fas fa-certificate"></i>
                <p>Official Distributor</p>
            </div>
        </div>
    `;

    // Render input Server ID jika perlu
    if (game.needsServerId) {
        serverIdContainer.innerHTML = `
            <div class="input-group">
                <i class="fas fa-server input-icon"></i>
                <input type="number" id="server-id" placeholder="Masukkan Server ID" oninput="updateSummary()">
            </div>
        `;
    } else {
        serverIdContainer.innerHTML = '';
    }
    
    // UPGRADE: Hapus `originalPrices` yang tidak perlu
    
    // Render produk dan pembayaran
    renderProducts(gameKey);
    renderPaymentMethods('payment-list'); // UPGRADE: Pakai fungsi reusable

    // --- Tambah Event Listeners ---
    
    // UPGRADE: Gunakan Event Delegation untuk pilihan kartu
    productListContainer.addEventListener('click', handleGridSelection);
    paymentListContainer.addEventListener('click', handleGridSelection);

    // Listener untuk input form
    document.getElementById('user-id').addEventListener('input', updateSummary);
    document.getElementById('whatsapp-number').addEventListener('input', updateSummary);
    // Listener untuk server-id sudah ditambahkan inline di atas (jika ada)
    
    // Listener untuk tombol voucher
    document.getElementById('use-voucher-btn').addEventListener('click', () => {
        const promoCode = promoCodeInput.value.toUpperCase();
        const voucherDiscount = 100;
        const selectedProductCard = document.querySelector('#product-list .option-card.selected');
        
        if (promoCode === "WALZPROMO") {
            isVoucherApplied = true;
            showNotification(`Voucher Berhasil! Potongan: ${formatRupiah(voucherDiscount)}`, true);
        } else {
            isVoucherApplied = false;
            showNotification('Voucher Tidak valid', false);
        }
        
        // Render ulang produk untuk tampilkan harga diskon
        renderProducts(gameKey);
        
        // Pilih kembali item yang tadi dipilih (jika ada)
        if (selectedProductCard) {
            const selectedId = selectedProductCard.dataset.id;
            const newCard = productListContainer.querySelector(`[data-id="${selectedId}"]`);
            if (newCard) {
                newCard.classList.add('selected');
            }
        }
        updateSummary();
    });

    // Listener untuk tombol konfirmasi
    document.getElementById('confirm-button').addEventListener('click', () => {
        const selectedProductCard = document.querySelector('#product-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');

        const productId = selectedProductCard ? selectedProductCard.dataset.id : '';
        const paymentId = selectedPaymentCard ? selectedPaymentCard.dataset.id : '';
        const userId = document.getElementById('user-id').value;
        const serverId = game.needsServerId ? document.getElementById('server-id').value : '';
        const whatsappNumber = document.getElementById('whatsapp-number').value;

        if (productId && paymentId && userId && whatsappNumber) {
            // Data valid, buat URL dan redirect ke cart.html
            const url = `cart.html?game_key=${gameKey}&product_id=${productId}&payment_id=${paymentId}&user_id=${userId}&server_id=${serverId}&whatsapp_number=${whatsappNumber}&voucher_applied=${isVoucherApplied}`;
            window.location.href = url;
        } else {
            showNotification('Mohon lengkapi semua data pesanan terlebih dahulu.', false);
        }
    });
}

// ========================
// Logika Halaman Cart
// ========================

function setupCartPage() {
    const params = new URLSearchParams(window.location.search);
    const gameKey = params.get('game_key');
    const productId = params.get('product_id');
    const paymentId = params.get('payment_id');
    const userId = params.get('user_id');
    const serverId = params.get('server_id');
    const whatsappNumber = params.get('whatsapp_number');
    const voucherApplied = params.get('voucher_applied') === 'true';

    const game = GAMES.find(g => g.key === gameKey);
    const product = PRODUCTS[gameKey] ? PRODUCTS[gameKey].find(p => p.id === productId) : null;
    const payment = PAYMENTS.find(p => p.id === paymentId);

    const cartSummaryCard = document.getElementById('cart-summary-card');
    const paymentInfoSection = document.getElementById('payment-info-section');
    const payButton = document.getElementById('pay-button');

    if (game && product && payment && cartSummaryCard) {
        const voucherDiscount = 100;
        const finalPrice = voucherApplied ? Math.max(0, product.price - voucherDiscount) : product.price;

        cartSummaryCard.innerHTML = `
            <h3>Rincian Pesanan</h3>
            <div class="summary-detail-item">
                <span class="label"><i class="fas fa-gamepad"></i> Game</span>
                <span class="value">${game.name}</span>
            </div>
            <div class="summary-detail-item">
                <span class="label"><i class="fas fa-gem"></i> Produk</span>
                <span class="value">${product.label}</span>
            </div>
            <div class="summary-detail-item">
                <span class="label"><i class="fas fa-user"></i> Player ID</span>
                <span class="value">${userId}${serverId ? ` (${serverId})` : ''}</span>
            </div>
            <div class="summary-detail-item">
                <span class="label"><i class="fas fa-wallet"></i> Metode Pembayaran</span>
                <span class="value">
                    <img src="${payment.img}" alt="${payment.name}" class="payment-image">
                    ${payment.name}
                </span>
            </div>
            <div class="summary-detail-item">
                <span class="label"><i class="fab fa-whatsapp"></i> Nomor WhatsApp</span>
                <span class="value">${whatsappNumber}</span>
            </div>
            <div class="summary-total">
                <span class="label">Total Pembayaran</span>
                <span class="value">${formatRupiah(finalPrice)}</span>
            </div>
        `;

        let paymentContent = '';
        if (payment.qr) {
            paymentContent = `
                <h4>Scan untuk Bayar</h4>
                <img src="${payment.qr}" alt="QR Code" class="qr-code-image">
                <div class="qr-caption">⚠️Perhatian: Transfer harus sesuai Dengan Harga Yang Tertera Di Atas⚠️
Silakan scan kode QR di atas untuk melakukan pembayaran. Setelah berhasil, klik **Bayar Sekarang**.</div>
            `;
        } else if (payment.number) {
            paymentContent = `
                <h4>Transfer ke ${payment.name}</h4>
                <img src="${payment.img}" alt="${payment.name}" class="payment-image">
                <div class="payment-caption">A.N. ${payment.holder}</div>
                <div class="payment-number">${payment.number}</div>
                <button class="copy-button" onclick="copyToClipboard('${payment.number}')">Salin Nomor</button>
            `;
        }

        paymentInfoSection.innerHTML = paymentContent;

        payButton.addEventListener('click', () => {
            const adminWhatsapp = '6282298902274';
            const message = `Halo Admin, saya ingin konfirmasi pesanan saya.\n\n*Detail Pesanan:*\nGame: ${game.name}\nProduk: ${product.label}\nPlayer ID: ${userId}${serverId ? ` (${serverId})` : ''}\nMetode Pembayaran: ${payment.name}\nTotal: ${formatRupiah(finalPrice)}\n\nNomor WA saya: ${whatsappNumber}\n\nMohon bantuannya untuk diproses, terima kasih.`;
            
            // UPGRADE: Pakai fungsi reusable
            redirectToWhatsapp(adminWhatsapp, message);
        });

    } else {
        cartSummaryCard.innerHTML = `
            <h3>Terjadi Kesalahan</h3>
            <p style="text-align: center; color: var(--text-color-light);">Data pesanan tidak ditemukan. Silakan kembali ke halaman utama.</p>
        `;
        if (payButton) payButton.style.display = 'none';
        if (paymentInfoSection) paymentInfoSection.style.display = 'none';
    }
}

// ========================
// Logika Halaman Pulsa
// ========================

function renderPulsaProducts() {
    const operatorSelect = document.getElementById('operator-select');
    const pulsaListContainer = document.getElementById("pulsa-list");
    if (!operatorSelect || !pulsaListContainer) return;

    pulsaListContainer.innerHTML = '';
    const selectedOperator = operatorSelect.value;
    const products = PRODUCTS["pulsa"][selectedOperator];

    if (products) {
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("option-card");
            productDiv.setAttribute('data-id', product.id);
            productDiv.setAttribute('data-label', product.label);
            productDiv.innerHTML = `
                <div class="label">${product.label}</div>
                <div class="price-group">
                    <div class="price">${formatRupiah(product.price)}</div>
                </div>
            `;
            // UPGRADE: onclick dihapus, diganti event delegation
            pulsaListContainer.appendChild(productDiv);
        });
    }
}

function updatePulsaSummary() {
    const selectedProductCard = document.querySelector('#pulsa-list .option-card.selected');
    const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
    const summaryCard = document.getElementById('summary-card');
    const confirmButton = document.getElementById('confirm-button');
    const phoneNumberInput = document.getElementById('phone-number');

    // UPGRADE: Validasi nomor HP pakai regex
    const phoneRegex = /^08[0-9]{8,11}$/; // 10-13 digit, mulai 08
    const isProductSelected = !!selectedProductCard;
    const isPaymentSelected = !!selectedPaymentCard;
    const isPhoneValid = phoneNumberInput && phoneRegex.test(phoneNumberInput.value);

    if (isProductSelected && isPaymentSelected && isPhoneValid) {
        summaryCard.style.display = 'block';
        confirmButton.disabled = false;

        const productLabel = selectedProductCard.dataset.label;
        const productId = selectedProductCard.dataset.id;
        const operatorSelect = document.getElementById('operator-select');
        const selectedOperator = operatorSelect.value;
        const product = PRODUCTS["pulsa"][selectedOperator].find(p => p.id === productId);

        document.getElementById('summary-product-details').innerHTML = `
            <i class="fas fa-mobile-alt" style="color:var(--accent-color);"></i>
            <span class="product-text">${productLabel}</span>
        `;
        document.getElementById('summary-price').innerText = formatRupiah(product.price);
    } else {
        summaryCard.style.display = 'none';
        confirmButton.disabled = true;
    }
}

function setupPulsaPage() {
    const paymentListContainer = document.getElementById("payment-list");
    const pulsaListContainer = document.getElementById("pulsa-list");
    const phoneNumberInput = document.getElementById('phone-number');
    const confirmButton = document.getElementById('confirm-button');
    const operatorSelect = document.getElementById('operator-select');

    if (!paymentListContainer || !phoneNumberInput || !operatorSelect || !pulsaListContainer) return;

    // Isi pilihan operator secara dinamis
    Object.keys(PRODUCTS["pulsa"]).forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.textContent = op.charAt(0).toUpperCase() + op.slice(1);
        operatorSelect.appendChild(option);
    });

    // Render produk awal & pembayaran
    renderPulsaProducts();
    renderPaymentMethods('payment-list'); // UPGRADE: Pakai fungsi reusable

    // --- Tambah Event Listeners ---
    
    // Listener untuk ganti operator
    operatorSelect.addEventListener('change', () => {
        renderPulsaProducts();
        updatePulsaSummary();
    });

    // Listener untuk input nomor HP
    phoneNumberInput.addEventListener('input', updatePulsaSummary);
    
    // UPGRADE: Gunakan Event Delegation untuk pilihan kartu
    pulsaListContainer.addEventListener('click', handleGridSelection);
    paymentListContainer.addEventListener('click', handleGridSelection);

    // Listener tombol konfirmasi
    confirmButton.addEventListener('click', () => {
        const selectedProductCard = document.querySelector('#pulsa-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
        const payment = PAYMENTS.find(p => p.id === selectedPaymentCard.dataset.id);
        
        const productLabel = selectedProductCard.dataset.label;
        const paymentName = payment.name;
        const phoneNumber = phoneNumberInput.value;
        
        const operatorSelect = document.getElementById('operator-select');
        const selectedOperator = operatorSelect.value;
        const product = PRODUCTS["pulsa"][selectedOperator].find(p => p.id === selectedProductCard.dataset.id);

        const adminWhatsapp = '6282298902274';
        const message = `Halo Admin, saya ingin konfirmasi pesanan pulsa.\n\n*Detail Pesanan:*\nNomor HP: ${phoneNumber}\nProduk: ${productLabel}\nMetode Pembayaran: ${paymentName}\nTotal: ${formatRupiah(product.price)}\n\nMohon bantuannya untuk diproses, terima kasih.`;
        
        // UPGRADE: Pakai fungsi reusable
        redirectToWhatsapp(adminWhatsapp, message);
    });
}

// ========================
// Logika Halaman Panel
// ========================

function setupPanelPage() {
    const productNameInput = document.getElementById('user-name');
    const whatsappInput = document.getElementById('user-whatsapp');
    const panelProductList = document.getElementById('panel-product-list');
    const orderButton = document.getElementById('panel-order-button');
    let selectedProduct = null;

    if (!panelProductList || !orderButton) return;

    // Render produk panel
    PRODUCTS["panel"].forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('option-card');
        productDiv.setAttribute('data-name', product.name);
        productDiv.setAttribute('data-price', product.price);
        productDiv.innerHTML = `
            <div class="label">${product.name}</div>
            <div class="price">${formatRupiah(product.price)}</div>
            <p class="description">${product.desc}</p>
        `;
        // UPGRADE: onclick dihapus, diganti event delegation
        panelProductList.appendChild(productDiv);
    });

    // Fungsi untuk update status tombol order
    function updatePanelButtonStatus() {
        // UPGRADE: Validasi WA pakai regex
        const phoneRegex = /^08[0-9]{8,11}$/;
        if (productNameInput.value && phoneRegex.test(whatsappInput.value) && selectedProduct) {
            orderButton.disabled = false;
        } else {
            orderButton.disabled = true;
        }
    }
    
    // --- Tambah Event Listeners ---
    
    // Listener untuk input
    [productNameInput, whatsappInput].forEach(input => {
        input.addEventListener('input', updatePanelButtonStatus);
    });

    // UPGRADE: Gunakan Event Delegation untuk pilihan kartu
    panelProductList.addEventListener('click', (event) => {
        const selectedCard = event.target.closest('.option-card');
        if (!selectedCard) return;
        
        // Hapus 'selected' dari semua kartu
        panelProductList.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        // Tambah 'selected' ke yang diklik
        selectedCard.classList.add('selected');
        
        // Cari dan simpan data produk yang dipilih
        const productName = selectedCard.dataset.name;
        selectedProduct = PRODUCTS["panel"].find(p => p.name === productName);
        
        updatePanelButtonStatus();
    });

    // Listener tombol order
    orderButton.addEventListener('click', () => {
        const name = productNameInput.value;
        const whatsapp = whatsappInput.value;
        
        if (!name || !whatsapp || !selectedProduct) {
            showNotification('Mohon lengkapi semua data.', false);
            return;
        }

        const adminWhatsapp = '6282298902274';
        const message = `Halo Admin, saya ingin memesan layanan Panel Pterodactyl.\n\n*Detail Pesanan:*\nNama: ${name}\nNomor WhatsApp: ${whatsapp}\nPaket: ${selectedProduct.name}\nHarga: ${formatRupiah(selectedProduct.price)}\n\nMohon bantuannya untuk diproses, terima kasih.`;
        
        // UPGRADE: Pakai fungsi reusable
        redirectToWhatsapp(adminWhatsapp, message);
    });

    updatePanelButtonStatus(); // Set status tombol awal
}

// ========================
// Logika Theme Toggle (Global)
// ========================

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return; // Tidak ada tombol di halaman ini

    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Inisialisasi tema saat load
    if (currentTheme) {
        body.classList.add(currentTheme);
    } else {
        body.classList.add('light-mode'); // Default
    }
    updateThemeIcon(); // Update ikon sesuai tema

    function updateThemeIcon() {
        const icon = themeToggleBtn.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        body.classList.remove('dark-mode', 'light-mode');
        body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// ========================
// Main DOMContentLoaded Router
// ========================
document.addEventListener("DOMContentLoaded", () => {
    // Setup global
    setupThemeToggle();
    
    // Router sederhana berbasis elemen
    if (document.querySelector('.game-grid-custom')) {
        // --- Halaman Index ---
        renderGameCards(GAMES);
        const searchInput = document.getElementById('game-search');
        if (searchInput) {
            // UPGRADE: Terapkan debounce ke live search
            searchInput.addEventListener('input', debounce(liveSearchGames, 300));
        }
    } else if (document.getElementById('topup-form')) {
        // --- Halaman Game ---
        setupGamePage();
    } else if (document.getElementById('cart-summary-card')) {
        // --- Halaman Cart ---
        setupCartPage();
    } else if (document.getElementById('topup-pulsa-form')) {
        // --- Halaman Pulsa ---
        setupPulsaPage();
    } else if (document.getElementById('panel-order-button')) {
        // --- Halaman Panel ---
        setupPanelPage();
    }
});
