// File: script.js

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan daftarProduk sudah dimuat
    if (typeof daftarProduk === 'undefined') {
        console.error("Produk data (produk.js) gagal dimuat.");
        return;
    }

    // Fungsi untuk memformat angka menjadi format mata uang Rupiah
    const formatRupiah = (angka) => {
        const number = parseInt(String(angka).replace(/\./g, ''), 10);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Fungsi untuk me-render daftar produk ke dalam tab
    const renderProduk = (kategori, targetElementId) => {
        const produkList = daftarProduk[kategori];
        const container = document.getElementById(targetElementId);
        container.innerHTML = ''; 

        if (!produkList || produkList.length === 0) {
            container.innerHTML = `<p class="text-center text-muted p-5">Produk ${kategori.toUpperCase()} belum tersedia saat ini.</p>`;
            return;
        }

        // Kontainer untuk tata letak kolom
        const priceContainer = document.createElement('div');
        priceContainer.className = 'price-container';
        
        produkList.forEach(produk => {
            const hargaRupiah = formatRupiah(produk.harga);

            const item = document.createElement('div');
            item.className = 'price-item';
            item.innerHTML = `
                <small class="text-muted product-description">${produk.operator}</small>
                <h6 class="product-name">${produk.nama}</h6>
                <p class="product-description">${produk.deskripsi}</p>
                <span class="price-amount">${hargaRupiah}</span>
            `;
            
            // Event listener untuk simulasi klik beli
            item.addEventListener('click', () => {
                alert(`Anda memilih: ${produk.nama} (${hargaRupiah}). Melanjutkan ke halaman pembayaran...`);
            });

            priceContainer.appendChild(item);
        });

        container.appendChild(priceContainer);
    };

    // Panggil fungsi render untuk setiap kategori saat halaman dimuat
    renderProduk('pulsa', 'pulsa');
    renderProduk('data', 'data');
    renderProduk('game', 'game');
    renderProduk('token', 'token');

    // ===================================
    // Logika Form Input Hero
    // ===================================
    const checkProductButton = document.getElementById('btn-cek-produk');
    const inputField = document.getElementById('input-tujuan');

    checkProductButton.addEventListener('click', () => {
        const inputVal = inputField.value.trim();
        
        if (inputVal.length === 0) {
            alert("Mohon masukkan nomor tujuan atau ID game Anda!");
            inputField.focus();
        } else if (inputVal.length < 5) {
            alert("Input terlalu pendek. Mohon masukkan ID/Nomor yang valid.");
        } else {
            // Logika nyata: Arahkan ke halaman pencarian produk spesifik
            alert(`Pencarian produk untuk ID/Nomor: ${inputVal}. (Simulasi: Akan tampil daftar harga spesifik).`);
            inputField.value = ''; 
        }
    });

});
