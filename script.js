// Ambil parameter URL game
const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('game');
const gameImg = urlParams.get('img');

if(gameName && gameImg){
  document.getElementById('gameName').innerText = gameName;
  document.getElementById('gameImage').src = gameImg;
}

// Diamond & Harga Pasar
const diamonds = [
  {name:"50 💎",price:"Rp5.000"},
  {name:"100 💎",price:"Rp10.000"},
  {name:"250 💎",price:"Rp24.000"},
  {name:"500 💎",price:"Rp48.000"},
  {name:"1000 💎",price:"Rp95.000"},
  {name:"2000 💎",price:"Rp190.000"},
];

const diamondGrid = document.getElementById('diamondGrid');
diamonds.forEach((d,i)=>{
  const div = document.createElement('div');
  div.className='diamond-item';
  div.innerHTML=`<p>${d.name}</p><span>${d.price}</span>`;
  div.addEventListener('click',()=>{document.querySelectorAll('.diamond-item').forEach(e=>e.classList.remove('selected')); div.classList.add('selected');});
  diamondGrid.appendChild(div);
});

// Metode Pembayaran
const payments = [
  {name:"QRIS",img:"https://files.catbox.moe/crlcvj.jpg",price:"Rp0"},
  {name:"ShopeePay",img:"https://files.catbox.moe/gub7ik.jpg",price:"Rp0"},
  {name:"Dana",img:"https://files.catbox.moe/vzij14.jpg",price:"Rp0"},
  {name:"Gopay",img:"https://files.catbox.moe/hjxbgp.jpg",price:"Rp0"},
  {name:"Ovo",img:"https://files.catbox.moe/uy94ct.jpg",price:"Rp0"},
];

const paymentGrid = document.getElementById('paymentGrid');
payments.forEach(p=>{
  const div = document.createElement('div');
  div.className='payment-item';
  div.innerHTML=`<img src="${p.img}" alt="${p.name}"><p>${p.name}</p><span>${p.price}</span>`;
  div.addEventListener('click',()=>{document.querySelectorAll('.payment-item').forEach(e=>e.classList.remove('selected')); div.classList.add('selected');});
  paymentGrid.appendChild(div);
});

// Tombol Kembali
document.getElementById('backBtn').addEventListener('click',()=>{window.location.href='index.html';});

// Checkout
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  const playerId = document.getElementById('playerId').value.trim();
  const diamond = document.querySelector('.diamond-item.selected');
  const payment = document.querySelector('.payment-item.selected');
  if(!playerId){alert('Masukkan ID / Nickname'); return;}
  if(!diamond){alert('Pilih paket diamond'); return;}
  if(!payment){alert('Pilih metode pembayaran'); return;}
  
  const voucher = document.getElementById('voucher').value.trim();
  let text=`Game: ${gameName}\nID: ${playerId}\nPaket: ${diamond.querySelector('p').innerText} - ${diamond.querySelector('span').innerText}\nMetode: ${payment.querySelector('p').innerText}\nHarga: ${payment.querySelector('span').innerText}`;
  if(voucher) text+=`\nVoucher: ${voucher}`;
  document.getElementById('popupText').innerText=text;
  document.getElementById('popup').classList.add('active');
});

// Konfirmasi WhatsApp
document.getElementById('confirmBtn').addEventListener('click',()=>{
  const msg=encodeURIComponent(document.getElementById('popupText').innerText);
  window.open(`https://wa.me/6282298902274?text=${msg}`, '_blank');
  document.getElementById('popup').classList.remove('active');
});