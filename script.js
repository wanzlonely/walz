function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

/**
 * UPGRADE: Fungsi debounce untuk membatasi 
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
 * @param {string} message - Pesan notifikasifunction showNotification(message, isSuccess = true) {
    // Pastikan container ada di DOM
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.classList.add('notification-container');
        document.body.appendChild(container);
    }

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
    // UPGRADE: Gunakan URLSearchParams
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
        // window.location.href = 'index.html'; // Redirect jika data tidak valid
        return; // Jangan jalankan sisa script jika elemen tidak ada
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
        const serverId = game.needsServerId && document.getElementById('server-id') ? document.getElementById('server-id').value : '';
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

    // Cek elemen
    const cartSummaryCard = document.getElementById('cart-summary-card');
    const paymentInfoSection = document.getElementById('payment-info-section');
    const payButton = document.getElementById('pay-button');

    if (!cartSummaryCard) return; // Keluar jika bukan halaman cart

    const game = GAMES.find(g => g.key === gameKey);
    const product = PRODUCTS[gameKey] ? PRODUCTS[gameKey].find(p => p.id === productId) : null;
    const payment = PAYMENTS.find(p => p.id === paymentId);

    if (game && product && payment) {
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

        if(paymentInfoSection) paymentInfoSection.innerHTML = paymentContent;

        if(payButton) payButton.addEventListener('click', () => {
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

    // Pastikan data pulsa dan operator ada
    if (!PRODUCTS["pulsa"] || !PRODUCTS["pulsa"][selectedOperator]) {
        pulsaListContainer.innerHTML = '<p class="no-results-message" style="text-align:center; color:var(--text-light);">Pilih operator.</p>';
        return;
    }

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

    const operatorSelect = document.getElementById('operator-select');
    if (!operatorSelect) return;
    const selectedOperator = operatorSelect.value;

    if (isProductSelected && isPaymentSelected && isPhoneValid && selectedOperator) {
        summaryCard.style.display = 'block';
        confirmButton.disabled = false;

        const productLabel = selectedProductCard.dataset.label;
        const productId = selectedProductCard.dataset.id;
        const product = PRODUCTS["pulsa"][selectedOperator].find(p => p.id === productId);

        if (!product) return; // Safety check

        document.getElementById('summary-product-details').innerHTML = `
            <i class="fas fa-mobile-alt" style="color:var(--accent-color);"></i>
            <span class="product-text">${productLabel}</span>
        `;
        document.getElementById('summary-price').innerText = formatRupiah(product.price);
    } else {
        if(summaryCard) summaryCard.style.display = 'none';
        if(confirmButton) confirmButton.disabled = true;
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
    // Tambahkan opsi "Pilih Operator"
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "-- Pilih Operator --";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    operatorSelect.appendChild(defaultOption);

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
    let currentTheme = localStorage.getItem('theme');

    // Inisialisasi tema saat load
    if (!currentTheme) {
        // Jika tidak ada di localStorage, cek preferensi sistem
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark-mode';
        } else {
            currentTheme = 'light-mode'; // Default
        }
    }

    body.classList.add(currentTheme);
    updateThemeIcon(currentTheme);

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark-mode') {
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
    // Pastikan data sudah di-load (cek salah satu data)
    if (typeof GAMES === 'undefined' || typeof PAYMENTS === 'undefined' || typeof PRODUCTS === 'undefined') {
        alert("Error: Gagal memuat file data.js. Pastikan file ada dan di-load sebelum script.js.");
        return;
    }

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