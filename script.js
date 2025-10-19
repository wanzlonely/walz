// --- 1. DATA APLIKASI (Konstanta) ---
// Gunakan huruf kapital untuk konstanta global
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
    { id: "qris", name: "QRIS", img: "https://i.supaimg.com/7b5fe49a-a708-4a05-8b00-9865481e0e13.jpg", qr: "https://files.catbox.moe/pa0iwo.png" },
    { id: "krom", name: "Bank Krom", img: "https://i.supaimg.com/20eaef7a-3a63-4be3-a507-175348ab41de.jpg", number: "770072009565", holder: "Walzshop ID" },
    { id: "dana", name: "Dana", img: "https://i.supaimg.com/e4a887fd-41fd-4075-9802-8b65bb52d1cb.jpg", number: "083139243389", holder: "Anom" },
    { id: "gopay", name: "Gopay", img: "https://i.supaimg.com/104ae434-3bb9-4071-a946-73b301a5ba29.jpg", number: "082298902274", holder: "Anom" }
];

// PRODUTS tetap seperti aslinya, karena isinya sudah sangat banyak.
const PRODUCTS = { /* ... data produk yang sangat panjang ... */
    "free-fire": [
        { id: "ff-5", label: "5 Diamonds", price: 901 },
        // ... produk lainnya
    ],
    // ... produk game lainnya
    "pulsa": {
        "telkomsel": [
            { id: "tel-5k", label: "Pulsa Rp 5.000", price: 6500 },
            // ... pulsa lainnya
        ]
        // ... operator lainnya
    },
    "panel": [
        { name: "Paket 1", price: 10000, desc: "1 CPU, 256 MB RAM, 1 GB Storage" },
        // ... paket panel lainnya
    ]
};
// END OF PRODUCTS DATA

// --- 2. STATE APLIKASI GLOBAL ---
let isVoucherApplied = false;
const VOUCHER_CODE = "WALZPROMO";
const VOUCHER_DISCOUNT = 100;
const ADMIN_WHATSAPP = '6282298902274';

// --- 3. UTILITY FUNCTIONS ---
const Utils = {
    formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    },

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    showNotification(message, isSuccess = true) {
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
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            Utils.showNotification('Nomor berhasil disalin!', true);
        }).catch(err => {
            console.error('Gagal menyalin:', err);
            Utils.showNotification('Gagal menyalin nomor. Coba lagi.', false);
        });
    }
};

// --- 4. THEME TOGGLE LOGIC ---
const ThemeManager = {
    init() {
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (!themeToggleBtn) return;

        const currentTheme = localStorage.getItem('theme');
        document.body.classList.add(currentTheme || 'light-mode');
        this.updateIcon(currentTheme || 'light-mode');

        themeToggleBtn.addEventListener('click', this.toggleTheme.bind(this));
    },

    updateIcon(theme) {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark-mode') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    },

    toggleTheme() {
        const body = document.body;
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        body.classList.remove('dark-mode', 'light-mode');
        body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateIcon(newTheme);
    }
};

// --- 5. CORE INTERACTION LOGIC ---
const Interaction = {
    // Fungsi untuk menandai pilihan (produk/pembayaran)
    selectOption(element, updateCallback) {
        const parent = element.closest('.options-grid');
        if (!parent) return;

        parent.querySelectorAll(`.option-card`).forEach(sibling => {
            sibling.classList.remove('selected');
        });
        element.classList.add('selected');

        // Panggil fungsi update summary yang relevan
        if (updateCallback) {
            updateCallback();
        }
    },

    // Mendapatkan harga akhir setelah diskon voucher
    getFinalPrice(productPrice) {
        return isVoucherApplied ? Math.max(0, productPrice - VOUCHER_DISCOUNT) : productPrice;
    }
};

// --- 6. PAGE SPECIFIC LOGIC ---

// --- Halaman Index ---
const IndexPage = {
    renderGameCards(gamesToRender) {
        const gameListContainer = document.getElementById('game-list');
        if (!gameListContainer) return;

        gameListContainer.innerHTML = '';
        if (gamesToRender.length === 0) {
            gameListContainer.innerHTML = '<p class="no-results-message" style="text-align:center; color:var(--text-light);">Game tidak ditemukan. 😔</p>';
            return;
        }

        gamesToRender.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add("game-card-custom");
            gameCard.innerHTML = `
                <a href="${game.url}">
                    <img src="${game.img}" alt="${game.name}" class="game-card-img" loading="lazy">
                    <div class="game-card-content-custom">
                        <h3>${game.name}</h3>
                        <p>${game.publisher}</p>
                    </div>
                </a>
            `;
            gameListContainer.appendChild(gameCard);
        });
    },

    liveSearchGames() {
        const searchInput = document.getElementById('game-search');
        const searchTerm = searchInput.value.toLowerCase();

        const filteredGames = GAMES.filter(game => {
            return game.name.toLowerCase().includes(searchTerm) ||
                game.publisher.toLowerCase().includes(searchTerm);
        });

        IndexPage.renderGameCards(filteredGames);
    },

    init() {
        this.renderGameCards(GAMES);
        const searchInput = document.getElementById('game-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.liveSearchGames);
        }
    }
};

// --- Halaman Game ---
const GamePage = {
    game: null, // State untuk game yang sedang dipilih

    renderProducts(gameKey) {
        const productListContainer = document.getElementById("product-list");
        if (!productListContainer) return;

        productListContainer.innerHTML = '';
        const products = PRODUCTS[gameKey];

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

                const finalPrice = Interaction.getFinalPrice(product.price);
                const originalPriceHtml = isVoucherApplied ? `<div class="original-price">${Utils.formatRupiah(product.price)}</div>` : '';

                productDiv.innerHTML = `
                    ${badgeHtml}
                    <i class="fas fa-gem icon"></i>
                    <div class="label">${product.label}</div>
                    <div class="price-group">
                        ${originalPriceHtml}
                        <div class="price">${Utils.formatRupiah(finalPrice)}</div>
                    </div>
                `;

                productDiv.onclick = () => {
                    Interaction.selectOption(productDiv, this.updateSummary.bind(this));
                };
                productListContainer.appendChild(productDiv);
            });
        }
    },

    renderPayments() {
        const paymentListContainer = document.getElementById("payment-list");
        if (!paymentListContainer) return;

        PAYMENTS.forEach(payment => {
            const paymentDiv = document.createElement("div");
            paymentDiv.classList.add("option-card", "payment");
            paymentDiv.setAttribute('data-id', payment.id);
            paymentDiv.innerHTML = `
                <img src="${payment.img}" alt="${payment.name}" loading="lazy">
                <div class="label">${payment.name}</div>
            `;
            paymentDiv.onclick = () => {
                Interaction.selectOption(paymentDiv, this.updateSummary.bind(this));
            };
            paymentListContainer.appendChild(paymentDiv);
        });
    },

    updateSummary() {
        const selectedProductCard = document.querySelector('#product-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
        const summaryCard = document.getElementById('summary-card');
        const confirmButton = document.getElementById('confirm-button');
        const userIdInput = document.getElementById('user-id');
        const whatsappInput = document.getElementById('whatsapp-number');
        const serverIdInput = document.getElementById('server-id');

        const isProductSelected = !!selectedProductCard;
        const isPaymentSelected = !!selectedPaymentCard;
        const isIdValid = userIdInput && userIdInput.value.length > 0;
        const isWhatsappValid = whatsappInput && whatsappInput.value.length > 0;

        let isServerIdValid = true;
        if (this.game.needsServerId) {
            isServerIdValid = serverIdInput && serverIdInput.value.length > 0;
        }

        if (isProductSelected && isPaymentSelected && isIdValid && isWhatsappValid && isServerIdValid) {
            summaryCard.style.display = 'flex'; // Mengubah menjadi flex untuk layout yang lebih baik
            confirmButton.disabled = false;

            const productId = selectedProductCard.dataset.id;
            const product = PRODUCTS[this.game.key].find(p => p.id === productId);
            const finalPrice = Interaction.getFinalPrice(product.price);

            document.getElementById('summary-product-details').innerHTML = `
                <i class="fas fa-gem" style="color:var(--accent-color);"></i>
                <span class="product-text">${product.label}</span>
            `;
            document.getElementById('summary-price').innerText = Utils.formatRupiah(finalPrice);
        } else {
            summaryCard.style.display = 'none';
            confirmButton.disabled = true;
        }
    },

    handleVoucher() {
        const promoCodeInput = document.getElementById('promo-code');
        const useVoucherBtn = document.getElementById('use-voucher-btn');

        useVoucherBtn.addEventListener('click', () => {
            const promoCode = promoCodeInput.value.toUpperCase();
            if (promoCode === VOUCHER_CODE) {
                if (!isVoucherApplied) {
                    isVoucherApplied = true;
                    this.renderProducts(this.game.key);
                    this.updateSummary();
                    Utils.showNotification(`Voucher Berhasil digunakan! Potongan: ${Utils.formatRupiah(VOUCHER_DISCOUNT)}`, true);
                } else {
                    Utils.showNotification('Voucher sudah digunakan.', false);
                }
            } else {
                if (isVoucherApplied) {
                    isVoucherApplied = false;
                    this.renderProducts(this.game.key);
                    this.updateSummary();
                    Utils.showNotification('Voucher tidak valid. Diskon dibatalkan.', false);
                } else {
                    Utils.showNotification('Voucher Tidak valid', false);
                }
            }
        });
    },

    handleConfirmation() {
        document.getElementById('confirm-button').addEventListener('click', () => {
            const selectedProductCard = document.querySelector('#product-list .option-card.selected');
            const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');

            const productId = selectedProductCard ? selectedProductCard.dataset.id : '';
            const paymentId = selectedPaymentCard ? selectedPaymentCard.dataset.id : '';
            const userId = document.getElementById('user-id').value;
            const serverId = this.game.needsServerId ? document.getElementById('server-id').value : '';
            const whatsappNumber = document.getElementById('whatsapp-number').value;

            if (productId && paymentId && userId && whatsappNumber) {
                const url = `cart.html?game_key=${this.game.key}&product_id=${productId}&payment_id=${paymentId}&user_id=${userId}&server_id=${serverId}&whatsapp_number=${whatsappNumber}&voucher_applied=${isVoucherApplied}`;
                window.location.href = url;
            } else {
                Utils.showNotification('Mohon lengkapi semua data pesanan terlebih dahulu. 😥', false);
            }
        });
    },

    init() {
        const gameKey = Utils.getUrlParameter('key');
        this.game = GAMES.find(g => g.key === gameKey);

        if (!this.game) {
            window.location.href = 'index.html';
            return;
        }

        const gameInfoHeader = document.getElementById("game-info-header");
        const serverIdContainer = document.getElementById("server-id-container");

        // Render Header
        gameInfoHeader.innerHTML = `
            <img src="${this.game.img}" alt="${this.game.name}" class="game-img">
            <h2>${this.game.name}</h2>
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

        // Render Server ID Input jika diperlukan
        if (this.game.needsServerId) {
            serverIdContainer.innerHTML = `
                <div class="input-group">
                    <i class="fas fa-server input-icon"></i>
                    <label for="server-id" class="visually-hidden">Server ID</label>
                    <input type="text" id="server-id" placeholder="Masukkan Server ID" required>
                </div>
            `;
            document.getElementById('server-id').addEventListener('input', this.updateSummary.bind(this));
        } else {
            serverIdContainer.innerHTML = '';
        }

        // Render Produk dan Pembayaran
        this.renderProducts(gameKey);
        this.renderPayments();

        // Setup Event Listeners untuk Form Validation
        ['user-id', 'whatsapp-number'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('input', this.updateSummary.bind(this));
        });

        this.handleVoucher();
        this.handleConfirmation();
    }
};

// --- Halaman Cart ---
const CartPage = {
    init() {
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
            const finalPrice = Interaction.getFinalPrice(product.price);

            // 1. Render Summary Card
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
                ${voucherApplied ? `
                    <div class="summary-detail-item voucher-applied">
                        <span class="label"><i class="fas fa-ticket-alt"></i> Diskon Voucher</span>
                        <span class="value">- ${Utils.formatRupiah(VOUCHER_DISCOUNT)}</span>
                    </div>` : ''}
                <div class="summary-detail-item">
                    <span class="label"><i class="fas fa-wallet"></i> Pembayaran</span>
                    <span class="value">
                        <img src="${payment.img}" alt="${payment.name}" class="payment-image">
                        ${payment.name}
                    </span>
                </div>
                <div class="summary-total">
                    <span class="label">Total Bayar</span>
                    <span class="value">${Utils.formatRupiah(finalPrice)}</span>
                </div>
            `;

            // 2. Render Payment Info
            let paymentContent = '';
            if (payment.qr) {
                paymentContent = `
                    <h4>Scan QRIS untuk Bayar</h4>
                    <img src="${payment.qr}" alt="QR Code" class="qr-code-image" loading="lazy">
                    <p class="qr-caption">⚠️ Transfer harus sesuai dengan total harga di atas. Setelah scan, klik tombol di bawah. ⚠️</p>
                `;
            } else if (payment.number) {
                paymentContent = `
                    <h4>Transfer Bank/E-Wallet</h4>
                    <div class="payment-instruction-box">
                        <img src="${payment.img}" alt="${payment.name}" class="payment-image-lg" loading="lazy">
                        <p class="account-holder">A.N. ${payment.holder}</p>
                        <div class="payment-number">${payment.number}</div>
                        <button class="copy-button" onclick="Utils.copyToClipboard('${payment.number}')">
                            <i class="fas fa-copy"></i> Salin Nomor Rekening
                        </button>
                    </div>
                `;
            }

            paymentInfoSection.innerHTML = paymentContent;

            // 3. Setup Pay Button
            payButton.addEventListener('click', () => {
                const message = `Halo Admin, saya ingin konfirmasi pesanan saya.\n\n*Detail Pesanan:*\nGame: ${game.name}\nProduk: ${product.label}\nPlayer ID: ${userId}${serverId ? ` (${serverId})` : ''}\nMetode Pembayaran: ${payment.name}\nTotal: ${Utils.formatRupiah(finalPrice)}\nNomor WA saya: ${whatsappNumber}\n\nMohon segera diproses, terima kasih.`;
                const encodedMessage = encodeURIComponent(message);
                window.location.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;
            });
        } else {
            cartSummaryCard.innerHTML = `
                <h3>Terjadi Kesalahan</h3>
                <p style="text-align: center; color: var(--text-color-light);">Data pesanan tidak ditemukan. Silakan kembali ke halaman utama. 😟</p>
            `;
            if (payButton) payButton.style.display = 'none';
            if (paymentInfoSection) paymentInfoSection.style.display = 'none';
        }
    }
};

// --- Halaman Pulsa ---
const PulsaPage = {
    renderPulsaProducts() {
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
                productDiv.setAttribute('data-price', product.price); // Simpan harga di data attribute
                productDiv.innerHTML = `
                    <div class="label">${product.label}</div>
                    <div class="price-group">
                        <div class="price">${Utils.formatRupiah(product.price)}</div>
                    </div>
                `;
                // Panggil updatePulsaSummary setelah option dipilih
                productDiv.onclick = () => Interaction.selectOption(productDiv, this.updatePulsaSummary.bind(this));
                pulsaListContainer.appendChild(productDiv);
            });
        }
    },

    updatePulsaSummary() {
        const selectedProductCard = document.querySelector('#pulsa-list .option-card.selected');
        const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
        const summaryCard = document.getElementById('summary-card');
        const confirmButton = document.getElementById('confirm-button');
        const phoneNumberInput = document.getElementById('phone-number');
        const operatorSelect = document.getElementById('operator-select');

        const isProductSelected = !!selectedProductCard;
        const isPaymentSelected = !!selectedPaymentCard;
        const isPhoneValid = phoneNumberInput && phoneNumberInput.value.length >= 10;
        const isOperatorSelected = operatorSelect.value !== "";

        if (isProductSelected && isPaymentSelected && isPhoneValid && isOperatorSelected) {
            summaryCard.style.display = 'block';
            confirmButton.disabled = false;

            const productLabel = selectedProductCard.dataset.label;
            const productPrice = selectedProductCard.dataset.price;

            document.getElementById('summary-product-details').innerHTML = `
                <i class="fas fa-mobile-alt" style="color:var(--accent-color);"></i>
                <span class="product-text">${productLabel}</span>
            `;
            document.getElementById('summary-price').innerText = Utils.formatRupiah(productPrice);
        } else {
            summaryCard.style.display = 'none';
            confirmButton.disabled = true;
        }
    },

    handleConfirmation() {
        document.getElementById('confirm-button').addEventListener('click', () => {
            const selectedProductCard = document.querySelector('#pulsa-list .option-card.selected');
            const selectedPaymentCard = document.querySelector('#payment-list .option-card.selected');
            const phoneNumber = document.getElementById('phone-number').value;

            if (!selectedProductCard || !selectedPaymentCard) {
                Utils.showNotification('Mohon lengkapi pilihan produk dan pembayaran.', false);
                return;
            }

            const productLabel = selectedProductCard.dataset.label;
            const productPrice = selectedProductCard.dataset.price;
            const paymentName = selectedPaymentCard.dataset.id;
            
            const message = `Halo Admin, saya ingin konfirmasi pesanan pulsa.\n\n*Detail Pesanan:*\nNomor HP: ${phoneNumber}\nProduk: ${productLabel}\nMetode Pembayaran: ${paymentName}\nTotal: ${Utils.formatRupiah(productPrice)}\n\nMohon bantuannya untuk diproses, terima kasih.`;
            const encodedMessage = encodeURIComponent(message);

            window.location.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;
        });
    },

    init() {
        const paymentListContainer = document.getElementById("payment-list");
        const phoneNumberInput = document.getElementById('phone-number');
        const operatorSelect = document.getElementById('operator-select');

        // 1. Isi Dropdown Operator
        Object.keys(PRODUCTS["pulsa"]).forEach(opKey => {
            const option = document.createElement('option');
            option.value = opKey;
            // Format Telkomsel, Indosat, dll.
            option.textContent = opKey.charAt(0).toUpperCase() + opKey.slice(1); 
            operatorSelect.appendChild(option);
        });

        // 2. Setup Payments
        PAYMENTS.forEach(payment => {
            const paymentDiv = document.createElement("div");
            paymentDiv.classList.add("option-card", "payment");
            paymentDiv.setAttribute('data-id', payment.id);
            paymentDiv.innerHTML = `
                <img src="${payment.img}" alt="${payment.name}" loading="lazy">
                <div class="label">${payment.name}</div>
            `;
            // Panggil updatePulsaSummary setelah option dipilih
            paymentDiv.onclick = () => Interaction.selectOption(paymentDiv, this.updatePulsaSummary.bind(this));
            paymentListContainer.appendChild(paymentDiv);
        });
        
        // 3. Setup Event Listeners
        operatorSelect.addEventListener('change', () => {
            // Reset pilihan pulsa saat operator berubah
            document.querySelectorAll('#pulsa-list .option-card').forEach(c => c.classList.remove('selected'));
            this.renderPulsaProducts();
            this.updatePulsaSummary();
        });

        phoneNumberInput.addEventListener('input', this.updatePulsaSummary.bind(this));
        
        this.handleConfirmation();
    }
};

// --- Halaman Panel ---
const PanelPage = {
    selectedProduct: null,

    updatePanelButtonStatus() {
        const productNameInput = document.getElementById('user-name');
        const whatsappInput = document.getElementById('user-whatsapp');
        const orderButton = document.getElementById('panel-order-button');
        
        if (productNameInput.value && whatsappInput.value && this.selectedProduct) {
            orderButton.disabled = false;
        } else {
            orderButton.disabled = true;
        }
    },

    handleConfirmation() {
        const orderButton = document.getElementById('panel-order-button');
        orderButton.addEventListener('click', () => {
            const name = document.getElementById('user-name').value;
            const whatsapp = document.getElementById('user-whatsapp').value;
            
            if (!name || !whatsapp || !this.selectedProduct) {
                Utils.showNotification('Mohon lengkapi semua data.', false);
                return;
            }

            const message = `Halo Admin, saya ingin memesan layanan Panel Pterodactyl.\n\n*Detail Pesanan:*\nNama: ${name}\nNomor WhatsApp: ${whatsapp}\nPaket: ${this.selectedProduct.name}\nHarga: ${Utils.formatRupiah(this.selectedProduct.price)}\n\nMohon bantuannya untuk diproses, terima kasih.`;
            const encodedMessage = encodeURIComponent(message);
            
            window.location.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;
        });
    },

    init() {
        const panelProductList = document.getElementById('panel-product-list');
        const productNameInput = document.getElementById('user-name');
        const whatsappInput = document.getElementById('user-whatsapp');

        if (!panelProductList) return;

        PRODUCTS["panel"].forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('option-card', 'panel-option');
            productDiv.innerHTML = `
                <div class="label">${product.name}</div>
                <div class="price">${Utils.formatRupiah(product.price)}</div>
                <p class="description">${product.desc}</p>
            `;
            productDiv.addEventListener('click', () => {
                document.querySelectorAll('#panel-product-list .option-card').forEach(c => c.classList.remove('selected'));
                productDiv.classList.add('selected');
                this.selectedProduct = product;
                this.updatePanelButtonStatus();
            });
            panelProductList.appendChild(productDiv);
        });

        // Gunakan 'input' event listener untuk validasi form real-time
        [productNameInput, whatsappInput].forEach(input => {
            input.addEventListener('input', this.updatePanelButtonStatus.bind(this));
        });

        this.handleConfirmation();
        this.updatePanelButtonStatus(); // Initial check
    }
};

// --- 7. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    ThemeManager.init();

    if (document.querySelector('.game-grid-custom')) {
        IndexPage.init();
    } else if (document.getElementById('topup-form')) {
        GamePage.init();
    } else if (document.getElementById('cart-summary-card')) {
        CartPage.init();
    } else if (document.getElementById('topup-pulsa-form')) {
        PulsaPage.init();
    } else if (document.getElementById('panel-form')) {
        PanelPage.init();
    }
});
