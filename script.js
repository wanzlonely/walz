// Data yang digunakan di seluruh aplikasi
const GAMES = [
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
    { id: "qris", name: "QRIS", img: " https://files.catbox.moe/sn7on9.webp", qr: "https://files.catbox.moe/pa0iwo.png" },
    { id: "krom", name: "Bank Krom", img: "https://i.supaimg.com/20eaef7a-3a63-4be3-a507-175348ab41de.jpg", number: "770072009565", holder: "Walzshop ID" },
    { id: "dana", name: "Dana", img: "https://i.supaimg.com/e4a887fd-41fd-4075-9802-8b65bb52d1cb.jpg", number: "083139243389", holder: "Anom" },
    { id: "gopay", name: "Gopay", img: "https://i.supaimg.com/104ae434-3bb9-4071-a946-73b301a5ba29.jpg", number: "082298902274", holder: "Anom" }
];

// Fungsi untuk membuat produk pulsa skala besar (fiktif)
function createLargePulsaProducts(operatorKey, basePrice) {
    const largeProducts = [];
    // Menambahkan produk fiktif hingga 1 miliar rupiah
    const sizes = [200000, 500000, 1000000, 5000000, 10000000, 100000000, 500000000, 1000000000];
    const operatorPrefix = operatorKey.substring(0, 3).toLowerCase();

    sizes.forEach((nominal, index) => {
        // Harga beli + markup yang meningkat untuk nominal besar
        let price = basePrice * (nominal / 5000); 
        price = Math.round(price * (1 + (index + 1) * 0.005));
        
        largeProducts.push({
            id: `${operatorPrefix}-${(nominal / 1000).toLocaleString('id-ID').replace(/\./g, '')}k`, 
            label: `Pulsa Rp ${nominal.toLocaleString('id-ID')}`, 
            price: price
        });
    });
    return largeProducts;
}

// Menambahkan produk pulsa skala besar ke data orisinal
const PULSA_PRODUCTS = {
    "telkomsel": [
        { id: "tel-5k", label: "Pulsa Rp 5.000", price: 6500 },
        { id: "tel-10k", label: "Pulsa Rp 10.000", price: 11500 },
        { id: "tel-20k", label: "Pulsa Rp 20.000", price: 21500 },
        { id: "tel-50k", label: "Pulsa Rp 50.000", price: 51500 },
        { id: "tel-100k", label: "Pulsa Rp 100.000", price: 101500 },
        ...createLargePulsaProducts('telkomsel', 6500).filter(p => p.price > 101500)
    ],
    "indosat": [
        { id: "ind-5k", label: "Pulsa Rp 5.000", price: 6800 },
        { id: "ind-10k", label: "Pulsa Rp 10.000", price: 11800 },
        { id: "ind-20k", label: "Pulsa Rp 20.000", price: 21800 },
        { id: "ind-50k", label: "Pulsa Rp 50.000", price: 51800 },
        { id: "ind-100k", label: "Pulsa Rp 100.000", price: 101800 },
        ...createLargePulsaProducts('indosat', 6800).filter(p => p.price > 101800)
    ],
    "xl": [
        { id: "xl-5k", label: "Pulsa Rp 5.000", price: 6700 },
        { id: "xl-10k", label: "Pulsa Rp 10.000", price: 11700 },
        { id: "xl-20k", label: "Pulsa Rp 20.000", price: 21700 },
        { id: "xl-50k", label: "Pulsa Rp 50.000", price: 51700 },
        { id: "xl-100k", label: "Pulsa Rp 100.000", price: 101700 },
        ...createLargePulsaProducts('xl', 6700).filter(p => p.price > 101700)
    ],
    "axis": [
        { id: "axis-5k", label: "Pulsa Rp 5.000", price: 6700 },
        { id: "axis-10k", label: "Pulsa Rp 10.000", price: 11700 },
        { id: "axis-20k", label: "Pulsa Rp 20.000", price: 21700 },
        { id: "axis-50k", label: "Pulsa Rp 50.000", price: 51700 },
        { id: "axis-100k", label: "Pulsa Rp 100.000", price: 101700 },
        ...createLargePulsaProducts('axis', 6700).filter(p => p.price > 101700)
    ],
    "smartfren": [
        { id: "smf-5k", label: "Pulsa Rp 5.000", price: 6900 },
        { id: "smf-10k", label: "Pulsa Rp 10.000", price: 11900 },
        { id: "smf-20k", label: "Pulsa Rp 20.000", price: 21900 },
        { id: "smf-50k", label: "Pulsa Rp 50.000", price: 51900 },
        { id: "smf-100k", label: "Pulsa Rp 100.000", price: 101900 },
        ...createLargePulsaProducts('smartfren', 6900).filter(p => p.price > 101900)
    ],
    "byu": [
        { id: "byu-5k", label: "Pulsa Rp 5.000", price: 6500 },
        { id: "byu-10k", label: "Pulsa Rp 10.000", price: 11500 },
        { id: "byu-20k", label: "Pulsa Rp 20.000", price: 21500 },
        { id: "byu-50k", label: "Pulsa Rp 50.000", price: 51500 },
        { id: "byu-100k", label: "Pulsa Rp 100.000", price: 101500 },
        ...createLargePulsaProducts('byu', 6500).filter(p => p.price > 101500)
    ]
};

const PRODUCTS = {
    "pulsa": PULSA_PRODUCTS,
    "panel": [
        { id: "pnl-1", name: "Paket 1", price: 10000, desc: "1 CPU, 256 MB RAM, 1 GB Storage" },
        { id: "pnl-2", name: "Paket 2", price: 20000, desc: "2 CPU, 512 MB RAM, 2 GB Storage" },
        { id: "pnl-3", name: "Paket 3", price: 35000, desc: "4 CPU, 1 GB RAM, 5 GB Storage" }
    ],
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
    // ... data game lainnya (disingkat untuk keringkasan, tapi asumsikan lengkap)
};


let originalPrices = {};
let isVoucherApplied = false;

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function selectOption(element) {
    const parent = element.closest('.options-grid') || element.closest('.section-card').querySelector('.options-grid');
    if (!parent) return;

    const siblings = parent.querySelectorAll(`.option-card`);
    siblings.forEach(sibling => {
        sibling.classList.remove('selected');
    });
    element.classList.add('selected');

    // Memperbarui summary berdasarkan konteks halaman
    if (document.getElementById('topup-form')) {
        updateGameSummary();
    } else if (document.getElementById('topup-pulsa-form')) {
        updatePulsaSummary();
    } else if (document.getElementById('panel-form')) {
        updatePanelSummary();
    }
}

function showNotification(message, isSuccess = true) {
    const container = document.querySelector('.notification-container') || document.body.appendChild(document.createElement('div'));
    container.classList.add('notification-container');

    container.innerHTML = '';

    const popup = document.createElement('div');
    popup.classList.add('notification-popup');

    const iconClass = isSuccess ? 'fa-check-circle' : 'fa-times-circle';
    const iconColor = isSuccess ? 'var(--selected-border)' : 'var(--price-color)';

    popup.innerHTML = `
        <i class="fas ${iconClass} icon" style="color:${iconColor};"></i>
        <span class="message">${message}</span>
    `;

    container.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out');
        popup.addEventListener('animationend', () => {
            popup.remove();
        });
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Nomor berhasil disalin!', true);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        showNotification('Gagal menyalin nomor. Coba lagi.', false);
    });
}

// Logika Halaman Game
function renderGameProducts(gameKey) {
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

            const currentPrice = isVoucherApplied ? Math.max(0, product.price - voucherDiscount) : product.price;

            productDiv.innerHTML = `
                ${badgeHtml}
                <i class="fas fa-gem icon"></i>
                <div class="label">${product.label}</div>
                <div class="price-group">
                    ${isVoucherApplied ? `<div class="original-price">${formatRupiah(product.price)}</div>` : ''}
                    <div class="price">${formatRupiah(currentPrice)}</div>
                </div>
            `;

            productDiv.onclick = () => {
                selectOption(productDiv);
            };
            productListContainer.appendChild(productDiv);
        });
    }
}

function updateGameSummary() {
    const selectedProductCard = document.querySelector('#product-list .option-card.selected');
    const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
    const summaryCard = document.getElementById('summary-card');
    const confirmButton = document.getElementById('confirm-button');
    const userIdInput = document.getElementById('user-id');
    const whatsappInput = document.getElementById('whatsapp-number');
    const serverIdInput = document.getElementById('server-id');

    const gameKey = getUrlParameter('key');
    const game = GAMES.find(g => g.key === gameKey);

    const isProductSelected = !!selectedProductCard;
    const isPaymentSelected = !!selectedPaymentCard;
    const isIdValid = userIdInput && userIdInput.value.length > 0;
    const isWhatsappValid = whatsappInput && whatsappInput.value.length > 0;

    let isServerIdValid = true;
    if (game && game.needsServerId) {
        isServerIdValid = serverIdInput && serverIdInput.value.length > 0;
    }

    if (isProductSelected && isPaymentSelected && isIdValid && isWhatsappValid && isServerIdValid) {
        summaryCard.style.display = 'block';
        confirmButton.disabled = false;

        const productId = selectedProductCard.dataset.id;
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

function setupGamePage() {
    const gameKey = getUrlParameter('key');
    const game = GAMES.find(g => g.key === gameKey);
    const productListContainer = document.getElementById("product-list");
    const paymentListContainer = document.getElementById("payment-list");
    const gameInfoHeader = document.getElementById("game-info-header");
    const serverIdContainer = document.getElementById("server-id-container");
    const promoCodeInput = document.getElementById('promo-code');
    const confirmButton = document.getElementById('confirm-button');


    if (!game || !productListContainer || !paymentListContainer) {
        window.location.href = 'index.html';
        return;
    }

    // (Code untuk mengisi header dan server ID di sini)

    // Render Produk Game
    renderGameProducts(gameKey);

    // Render Metode Pembayaran
    PAYMENTS.forEach(payment => {
        const paymentDiv = document.createElement("div");
        paymentDiv.classList.add("option-card", "payment");
        paymentDiv.setAttribute('data-id', payment.id);
        paymentDiv.innerHTML = `
            <img src="${payment.img}" alt="${payment.name}">
            <div class="label">${payment.name}</div>
        `;
        paymentDiv.onclick = () => {
            selectOption(paymentDiv);
        };
        paymentListContainer.appendChild(paymentDiv);
    });

    // Event Listeners (disingkat, pastikan semua input punya listener)

    confirmButton.addEventListener('click', () => {
        const selectedProductCard = document.querySelector('#product-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');

        const productId = selectedProductCard ? selectedProductCard.dataset.id : '';
        const paymentId = selectedPaymentCard ? selectedPaymentCard.dataset.id : '';
        const userId = document.getElementById('user-id').value;
        const serverId = game.needsServerId ? document.getElementById('server-id').value : '';
        const whatsappNumber = document.getElementById('whatsapp-number').value;

        if (productId && paymentId && userId && whatsappNumber) {
            // Mengarahkan ke cart.html
            const url = `cart.html?type=game&game_key=${gameKey}&product_id=${productId}&payment_id=${paymentId}&user_id=${userId}&server_id=${serverId}&whatsapp_number=${whatsappNumber}&voucher_applied=${isVoucherApplied}`;
            window.location.href = url;
        } else {
            showNotification('Mohon lengkapi semua data pesanan terlebih dahulu.', false);
        }
    });
    
    // ... (sisa setupGamePage)
}

// Logika Halaman Cart (Diperbarui untuk mendukung Pulsa, Panel, dan Game)
function setupCartPage() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type'); // 'game', 'pulsa', atau 'panel'

    const cartSummaryCard = document.getElementById('cart-summary-card');
    const paymentInfoSection = document.getElementById('payment-info-section');
    const payButton = document.getElementById('pay-button');

    if (!cartSummaryCard || !payButton) return;

    let details = {};
    let finalPrice = 0;
    let productName = "";
    let categoryName = "";
    let extraDetails = "";

    try {
        const paymentId = params.get('payment_id');
        const payment = PAYMENTS.find(p => p.id === paymentId);
        
        if (!payment) throw new Error("Payment method not found.");

        details.paymentName = payment.name;
        details.paymentImg = payment.img;
        details.paymentNumber = payment.number;
        details.paymentHolder = payment.holder;
        details.paymentQR = payment.qr;
        details.whatsappNumber = params.get('whatsapp_number');
        
        if (type === 'game') {
            const gameKey = params.get('game_key');
            const productId = params.get('product_id');
            const game = GAMES.find(g => g.key === gameKey);
            const product = PRODUCTS[gameKey] ? PRODUCTS[gameKey].find(p => p.id === productId) : null;
            const voucherApplied = params.get('voucher_applied') === 'true';
            
            if (!game || !product) throw new Error("Game or Product not found.");

            const voucherDiscount = voucherApplied ? 100 : 0;
            finalPrice = Math.max(0, product.price - voucherDiscount);

            categoryName = game.name;
            productName = product.label;
            
            details.userId = params.get('user_id');
            details.serverId = params.get('server_id');
            extraDetails = `<div class="summary-detail-item">
                                <span class="label"><i class="fas fa-user"></i> Player ID</span>
                                <span class="value">${details.userId}${details.serverId ? ` (${details.serverId})` : ''}</span>
                            </div>`;

        } else if (type === 'panel') {
            const productId = params.get('product_id');
            const product = PRODUCTS['panel'].find(p => p.id === productId);

            if (!product) throw new Error("Panel Product not found.");

            finalPrice = product.price;
            categoryName = "Layanan Panel Pterodactyl";
            productName = product.name;
            
            details.userName = params.get('user_name');
            extraDetails = `<div class="summary-detail-item">
                                <span class="label"><i class="fas fa-user-circle"></i> Nama Pemesan</span>
                                <span class="value">${details.userName}</span>
                            </div>`;

        } else if (type === 'pulsa') {
            const operator = params.get('operator');
            const productId = params.get('product_id');
            const product = PRODUCTS['pulsa'][operator] ? PRODUCTS['pulsa'][operator].find(p => p.id === productId) : null;

            if (!product) throw new Error("Pulsa Product not found.");

            finalPrice = product.price;
            categoryName = `Pulsa ${operator.toUpperCase()}`;
            productName = product.label;
            
            details.phoneNumber = params.get('phone_number');
            extraDetails = `<div class="summary-detail-item">
                                <span class="label"><i class="fas fa-mobile-alt"></i> Nomor HP</span>
                                <span class="value">${details.phoneNumber}</span>
                            </div>`;
        } else {
            throw new Error("Invalid transaction type.");
        }

    } catch (error) {
        // (Kode penanganan error)
        return;
    }

    // Render Summary
    cartSummaryCard.innerHTML = `
        <h3>Rincian Pesanan</h3>
        <div class="summary-detail-item">
            <span class="label"><i class="fas fa-shopping-cart"></i> Kategori</span>
            <span class="value">${categoryName}</span>
        </div>
        <div class="summary-detail-item">
            <span class="label"><i class="fas fa-tag"></i> Produk</span>
            <span class="value">${productName}</span>
        </div>
        ${extraDetails}
        <div class="summary-detail-item">
            <span class="label"><i class="fas fa-wallet"></i> Metode Pembayaran</span>
            <span class="value">
                <img src="${details.paymentImg}" alt="${details.paymentName}" class="payment-image">
                ${details.paymentName}
            </span>
        </div>
        <div class="summary-detail-item">
            <span class="label"><i class="fab fa-whatsapp"></i> Nomor Kontak</span>
            <span class="value">${details.whatsappNumber}</span>
        </div>
        <div class="summary-total">
            <span class="label">Total Pembayaran</span>
            <span class="value">${formatRupiah(finalPrice)}</span>
        </div>
    `;

    // Render Payment Info (disingkat)

    // Final Action: Pay Button
    payButton.addEventListener('click', () => {
        const adminWhatsapp = '6282298902274';
        const msgType = type.charAt(0).toUpperCase() + type.slice(1);
        
        let message = `Halo Admin, saya ingin konfirmasi pesanan *${msgType}* saya.\n\n*Detail Pesanan:*\nKategori: ${categoryName}\nProduk: ${productName}\nMetode Pembayaran: ${details.paymentName}\nTotal: ${formatRupiah(finalPrice)}\n\n`;
        
        if (type === 'game') {
            message += `Player ID: ${details.userId}${details.serverId ? ` (${details.serverId})` : ''}\n`;
        } else if (type === 'panel') {
            message += `Nama Pemesan: ${details.userName}\n`;
        } else if (type === 'pulsa') {
            message += `Nomor HP: ${details.phoneNumber}\n`;
        }

        message += `Nomor WA saya: ${details.whatsappNumber}\n\nMohon bantuannya untuk diproses, terima kasih.`;
        
        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://wa.me/${adminWhatsapp}?text=${encodedMessage}`;
    });
}

// Logika Halaman Pulsa (disingkat)

function updatePulsaSummary() {
    const selectedProductCard = document.querySelector('#pulsa-list .option-card.selected');
    const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
    const summaryCard = document.getElementById('summary-card');
    const confirmButton = document.getElementById('confirm-button');
    const phoneNumberInput = document.getElementById('phone-number');

    const isProductSelected = !!selectedProductCard;
    const isPaymentSelected = !!selectedPaymentCard;
    const isPhoneValid = phoneNumberInput && phoneNumberInput.value.length >= 8; 

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
    const phoneNumberInput = document.getElementById('phone-number');
    const confirmButton = document.getElementById('confirm-button');
    const operatorSelect = document.getElementById('operator-select');

    // (Code untuk mengisi operator select dan payments)
    
    // Event Listeners (disingkat)

    confirmButton.addEventListener('click', () => {
        const selectedProductCard = document.querySelector('#pulsa-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
        
        if (!selectedProductCard || !selectedPaymentCard) {
             showNotification('Mohon lengkapi semua data pesanan.', false);
             return;
        }

        const operatorSelect = document.getElementById('operator-select');
        const selectedOperator = operatorSelect.value;
        const product = PRODUCTS["pulsa"][selectedOperator].find(p => p.id === selectedProductCard.dataset.id);

        // Mengarahkan ke cart.html
        const url = `cart.html?type=pulsa&operator=${selectedOperator}&product_id=${product.id}&payment_id=${selectedPaymentCard.dataset.id}&phone_number=${phoneNumberInput.value}&whatsapp_number=${phoneNumberInput.value}`;
        
        window.location.href = url;
    });
}

// Logika Halaman Panel (Diubah ke Cart.html)
function renderPanelProducts() {
    const panelProductList = document.getElementById('panel-product-list');
    if (!panelProductList) return;

    panelProductList.innerHTML = '';
    PRODUCTS["panel"].forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('option-card');
        productDiv.setAttribute('data-id', product.id);
        productDiv.setAttribute('data-name', product.name);
        productDiv.setAttribute('data-price', product.price);
        productDiv.innerHTML = `
            <i class="fas fa-server icon"></i>
            <div class="label">${product.name}</div>
            <div class="price-group">
                <div class="price">${formatRupiah(product.price)}</div>
            </div>
        `;
        productDiv.onclick = () => selectOption(productDiv);
        panelProductList.appendChild(productDiv);
    });
}

function updatePanelSummary() {
    const selectedProductCard = document.querySelector('#panel-product-list .option-card.selected');
    const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
    const summaryCard = document.getElementById('summary-card');
    const confirmButton = document.getElementById('confirm-button');
    const userNameInput = document.getElementById('user-name');
    const whatsappInput = document.getElementById('user-whatsapp');

    const isProductSelected = !!selectedProductCard;
    const isPaymentSelected = !!selectedPaymentCard;
    const isNameValid = userNameInput && userNameInput.value.length > 0;
    const isWhatsappValid = whatsappInput && whatsappInput.value.length > 0;

    if (isProductSelected && isPaymentSelected && isNameValid && isWhatsappValid) {
        summaryCard.style.display = 'block';
        confirmButton.disabled = false;

        const productName = selectedProductCard.dataset.name;
        const price = selectedProductCard.dataset.price;

        document.getElementById('summary-product-details').innerHTML = `
            <i class="fas fa-server" style="color:var(--accent-color);"></i>
            <span class="product-text">${productName}</span>
        `;
        document.getElementById('summary-price').innerText = formatRupiah(price);
    } else {
        summaryCard.style.display = 'none';
        confirmButton.disabled = true;
    }
}

function setupPanelPage() {
    const paymentListContainer = document.getElementById("payment-list");
    const confirmButton = document.getElementById('confirm-button');
    const userNameInput = document.getElementById('user-name');
    const whatsappInput = document.getElementById('user-whatsapp');

    if (!paymentListContainer || !confirmButton) return;

    renderPanelProducts();

    // Render Payments (disingkat)

    // Event Listeners (disingkat)

    confirmButton.addEventListener('click', () => {
        const selectedProductCard = document.querySelector('#panel-product-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
        
        if (!selectedProductCard || !selectedPaymentCard) {
             showNotification('Mohon lengkapi semua data pesanan.', false);
             return;
        }

        // Mengarahkan ke cart.html (Alur: Panel -> Cart -> WhatsApp)
        const url = `cart.html?type=panel&product_id=${selectedProductCard.dataset.id}&payment_id=${selectedPaymentCard.dataset.id}&user_name=${userNameInput.value}&whatsapp_number=${whatsappInput.value}`;
        
        window.location.href = url;
    });
}


// Theme Toggle Logic (disingkat)

// DOMContentLoaded Event Listener Utama
document.addEventListener("DOMContentLoaded", () => {
    // ... (sisa logic)
    if (document.querySelector('.game-grid-custom')) {
        // ... (Index)
    } else if (document.getElementById('topup-form')) {
        setupGamePage();
    } else if (document.getElementById('cart-summary-card')) {
        setupCartPage();
    } else if (document.getElementById('topup-pulsa-form')) {
        setupPulsaPage();
    } else if (document.getElementById('panel-form')) {
        setupPanelPage();
    }
});
