// Ambil parameter game dari URL
const params = new URLSearchParams(window.location.search);
const game = params.get('game');
const img = params.get('img');

// DOM
const gameName = document.getElementById('gameName');
const gameImage = document.getElementById('gameImage');
const diamondItems = document.querySelectorAll('.diamond-item');
const paymentItems = document.querySelectorAll('.payment-item');
const checkoutBtn = document.getElementById('checkoutBtn');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');
const confirmBtn = document.getElementById('confirmBtn');

let selectedDiamond = '';
let selectedPrice = '';
let selectedPayment = '';

// Set nama & gambar game
gameName.textContent = game;
gameImage.src = img;

// Pilih Diamond
diamondItems.forEach(item => {
  item.addEventListener('click', () => {
    diamondItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    selectedDiamond = item.dataset.value;
    selectedPrice = item.dataset.price;
  });
});

// Pilih Metode Pembayaran
paymentItems.forEach(item => {
  item.addEventListener('click', () => {
    paymentItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    selectedPayment = item.dataset.value;
  });
});

// Checkout → popup
checkoutBtn.addEventListener('click', () => {
  const playerId = document.getElementById('playerId').value.trim();
  const voucher = document.getElementById('voucher').value.trim();

  if (!playerId) { alert("Masukkan ID / Nickname!"); return; }
  if (!selectedDiamond) { alert("Pilih paket diamond!"); return; }
  if (!selectedPayment) { alert("Pilih metode pembayaran!"); return; }

  popupText.innerHTML = `
    Game: <b>${game}</b><br>
    ID/Nickname: <b>${playerId}</b><br>
    Diamond: <b>${selectedDiamond}</b> - <b>${selectedPrice}</b><br>
    Metode: <b>${selectedPayment}</b><br>
    Voucher: <b>${voucher || '-'}</b>
  `;
  popup.classList.add('active');
});

// Konfirmasi → WhatsApp
confirmBtn.addEventListener('click', () => {
  const playerId = document.getElementById('playerId').value.trim();
  const voucher = document.getElementById('voucher').value.trim();
  const whatsappNumber = '6282298902274';
  const message = encodeURIComponent(
    `Halo, saya ingin melakukan top up:\nGame: ${game}\nID/Nickname: ${playerId}\nDiamond: ${selectedDiamond} - ${selectedPrice}\nMetode: ${selectedPayment}\nVoucher: ${voucher || '-'}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
});