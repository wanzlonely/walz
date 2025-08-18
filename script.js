const waNumber = '6282298902274';

// Filter kategori
const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.addEventListener('change', () => {
  const selected = categoryFilter.value;
  const cards = document.querySelectorAll('.game-card');
  cards.forEach(card => {
    if(selected === 'all' || card.dataset.category === selected){
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// Pilih paket
const packageButtons = document.querySelectorAll('.package');
packageButtons.forEach(pkg => {
  pkg.addEventListener('click', () => {
    const parent = pkg.parentElement;
    parent.querySelectorAll('.package').forEach(p => p.classList.remove('active'));
    pkg.classList.add('active');
  });
});

// Tombol beli
const buyButtons = document.querySelectorAll('.buyBtn');
const popup = document.getElementById('popup');

buyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.game-card');
    const gameName = card.dataset.game;
    const gameId = card.querySelector('.idInput').value.trim();
    const selectedPackage = card.querySelector('.package.active');
    const payment = card.querySelector('.payment').value;
    const voucher = card.querySelector('.voucher').value.trim();

    if(!gameId || !selectedPackage || !payment){
      alert('Mohon lengkapi semua data: ID Game, Paket, Metode Pembayaran!');
      return;
    }

    const packageName = selectedPackage.dataset.price;
    let message = `Halo, saya ingin membeli top up:\nGame: ${gameName}\nID Game: ${gameId}\nPaket: ${packageName}\nMetode Pembayaran: ${payment}`;
    if(voucher) message += `\nKode Voucher: ${voucher}`;

    // Tampilkan popup sukses
    popup.style.display = 'flex';
    setTimeout(() => {
      popup.style.display = 'none';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }, 1500); // 1.5 detik sebelum diarahkan ke WhatsApp
  });
});