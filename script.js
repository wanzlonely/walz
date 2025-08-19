// Ambil parameter game dari URL
const params = new URLSearchParams(window.location.search);
const game = params.get('game') || 'Game';
const img = params.get('img') || '';

// DOM
const gameName = document.getElementById('gameName');
const gameImage = document.getElementById('gameImage');
const diamondGrid = document.getElementById('diamondGrid');
const paymentGrid = document.getElementById('paymentGrid');
const checkoutBtn = document.getElementById('checkoutBtn');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');
const confirmBtn = document.getElementById('confirmBtn');
const backBtn = document.getElementById('backBtn');

let selectedDiamond = null;
let selectedPayment = null;

// Set nama & gambar game
gameName.textContent = game;
gameImage.src = img;

// Paket Diamond lengkap
const diamonds = [
  {value:50, price:"Rp5.000", market:"Rp6.000"},
  {value:100, price:"Rp10.000", market:"Rp12.000"},
  {value:250, price:"Rp22.000", market:"Rp25.000"},
  {value:500, price:"Rp45.000", market:"Rp50.000"},
  {value:1000, price:"Rp85.000", market:"Rp90.000"},
  {value:2000, price:"Rp160.000", market:"Rp180.000"}
];

diamonds.forEach(d => {
  const div = document.createElement('div');
  div.classList.add('diamond-item');
  div.dataset.value = d.value;
  div.dataset.price = d.price;
  div.innerHTML = `${d.value} 💎<span class="price">${d.price} (Pasar: ${d.market})</span>`;
  div.addEventListener('click', () => {
    document.querySelectorAll('.diamond-item').forEach(i=>i.classList.remove('selected'));
    div.classList.add('selected');
    selectedDiamond = d;
  });
  diamondGrid.appendChild(div);
});

// Metode pembayaran lengkap
const payments = [
  {name:"QRIS", img:"https://files.catbox.moe/crlcvj.jpg"},
  {name:"ShopeePay", img:"https://files.catbox.moe/gub7ik.jpg"},
  {name:"Dana", img:"https://files.catbox.moe/vzij14.jpg"},
  {name:"Gopay", img:"https://files.catbox.moe/hjxbgp.jpg"},
  {name:"Ovo", img:"https://files.catbox.moe/uy94ct.jpg"}
];

payments.forEach(p => {
  const div = document.createElement('div');
  div.classList.add('payment-item');
  div.dataset.value = p.name;
  div.innerHTML = `<img src="${p.img}" alt="${p.name}"><span>${p.name}</span>`;
  div.addEventListener('click', () => {
    document.querySelectorAll('.payment-item').forEach(i=>i.classList.remove('selected'));
    div.classList.add('selected');
    selectedPayment = p.name;
  });
  paymentGrid.appendChild(div);
});

// Tombol kembali
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Checkout → popup
checkoutBtn.addEventListener('click', () => {
  const playerId = document.getElementById('playerId').value.trim();
  const voucher = document.getElementById('voucher').value.trim();

  if(!playerId){ alert("Masukkan ID / Nickname!"); return; }
  if(!selectedDiamond){ alert("Pilih paket diamond!"); return; }
  if(!selectedPayment){ alert("Pilih metode pembayaran!"); return; }

  popupText.innerHTML = `
    Game: <b>${game}</b><br>
    ID/Nickname: <b>${playerId}</b><br>
    Diamond: <b>${selectedDiamond.value}</b> - <b>${selectedDiamond.price}</b> (Pasar: ${selectedDiamond.market})<br>
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
    `Halo, saya ingin melakukan top up:\nGame: ${game}\nID/Nickname: ${playerId}\nDiamond: ${selectedDiamond.value} - ${selectedDiamond.price} (Pasar: ${selectedDiamond.market})\nMetode: ${selectedPayment}\nVoucher: ${voucher || '-'}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
});