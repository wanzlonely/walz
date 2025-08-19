// --- Ambil parameter dari halaman 1 ---
const params = new URLSearchParams(window.location.search);
const gameName = params.get('game') || '';
const gameImg = params.get('img') || '';

const elName = document.getElementById('gameName');
const elImg  = document.getElementById('gameImage');

if (elName) elName.textContent = gameName || 'Game';
if (elImg && gameImg) { elImg.src = gameImg; elImg.alt = gameName; }

// --- Game yang butuh Server ID ---
const serverGames = ['Mobile Legend', 'Honor of Kings'];

// --- Data paket diamond per game (lengkap) ---
const DIAMONDS = {
  'Free Fire': [
    { name: '50 💎',   price: 'Rp5.000'   },
    { name: '70 💎',   price: 'Rp7.000'   },
    { name: '100 💎',  price: 'Rp10.000'  },
    { name: '140 💎',  price: 'Rp14.000'  },
    { name: '210 💎',  price: 'Rp20.000'  },
    { name: '355 💎',  price: 'Rp33.000'  },
    { name: '530 💎',  price: 'Rp50.000'  },
    { name: '720 💎',  price: 'Rp68.000'  },
    { name: '1080 💎', price: 'Rp95.000'  },
    { name: '2200 💎', price: 'Rp185.000' }
  ],
  'Mobile Legend': [
    { name: '86 💎',   price: 'Rp20.000'  },
    { name: '172 💎',  price: 'Rp40.000'  },
    { name: '257 💎',  price: 'Rp60.000'  },
    { name: '344 💎',  price: 'Rp80.000'  },
    { name: '429 💎',  price: 'Rp100.000' },
    { name: '514 💎',  price: 'Rp120.000' },
    { name: '706 💎',  price: 'Rp160.000' },
    { name: '1000 💎', price: 'Rp230.000' },
    { name: '1412 💎', price: 'Rp320.000' },
    { name: '2010 💎', price: 'Rp450.000' }
  ],
  'Honor of Kings': [
    { name: '100 💎',  price: 'Rp15.000'  },
    { name: '200 💎',  price: 'Rp28.000'  },
    { name: '300 💎',  price: 'Rp40.000'  },
    { name: '450 💎',  price: 'Rp58.000'  },
    { name: '600 💎',  price: 'Rp80.000'  },
    { name: '900 💎',  price: 'Rp115.000' },
    { name: '1200 💎', price: 'Rp150.000' },
    { name: '1800 💎', price: 'Rp220.000' },
    { name: '2400 💎', price: 'Rp290.000' }
  ],
  'Genshin Impact': [
    { name: '60 💎',    price: 'Rp15.000'    },
    { name: '300 💎',   price: 'Rp75.000'    },
    { name: '980 💎',   price: 'Rp225.000'   },
    { name: '1980 💎',  price: 'Rp450.000'   },
    { name: '3280 💎',  price: 'Rp750.000'   },
    { name: '6480 💎',  price: 'Rp1.500.000' }
  ],
  'Roblox': [
    { name: '80 💎',   price: 'Rp15.000'  },
    { name: '160 💎',  price: 'Rp30.000'  },
    { name: '400 💎',  price: 'Rp75.000'  },
    { name: '800 💎',  price: 'Rp150.000' },
    { name: '1700 💎', price: 'Rp300.000' },
    { name: '4500 💎', price: 'Rp750.000' }
  ]
};

// --- Metode pembayaran (gambar + nama + fee/harga) ---
const PAYMENTS = [
  { name: 'QRIS',      img: 'https://files.catbox.moe/crlcvj.jpg', price: '+ Rp1.000' },
  { name: 'ShopeePay', img: 'https://files.catbox.moe/gub7ik.jpg', price: '+ Rp1.500' },
  { name: 'Dana',      img: 'https://files.catbox.moe/vzij14.jpg', price: '+ Rp1.500' },
  { name: 'Gopay',     img: 'https://files.catbox.moe/hjxbgp.jpg', price: '+ Rp2.000' },
  { name: 'Ovo',       img: 'https://files.catbox.moe/uy94ct.jpg', price: '+ Rp2.000' }
];

// --- Sisipkan field Server ID jika diperlukan ---
(function maybeInsertServerId() {
  if (!serverGames.includes(gameName)) return;
  const form = document.querySelector('.checkout-form');
  if (!form) return;

  const label = document.createElement('label');
  label.setAttribute('for', 'serverId');
  label.textContent = 'Server ID';

  const input = document.createElement('input');
  input.id = 'serverId';
  input.type = 'text';
  input.placeholder = 'Masukkan Server ID';

  const diamondList = document.getElementById('diamondList');
  form.insertBefore(input, diamondList);
  form.insertBefore(label, input);
})();

// --- Render diamond & payment ---
let selectedDiamond = null;
let selectedPayment = null;

function renderDiamonds() {
  const list = document.getElementById('diamondList');
  list.innerHTML = '';
  const items = DIAMONDS[gameName] || [];
  items.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'diamond-item fade-in';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `<p>${d.name}</p><span>${d.price}</span>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.diamond-item').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');
      selectedDiamond = d;
    });
    list.appendChild(card);
  });
  if (items.length === 0) {
    const info = document.createElement('div');
    info.className = 'diamond-item';
    info.innerHTML = `<p>Paket belum tersedia</p><span>Silakan pilih game dari beranda</span>`;
    list.appendChild(info);
  }
}

function renderPayments() {
  const list = document.getElementById('paymentList');
  list.innerHTML = '';
  PAYMENTS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'payment-item fade-in';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <p>${p.name}</p>
      <span>${p.price}</span>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-item').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');
      selectedPayment = p;
    });
    list.appendChild(card);
  });
}

renderDiamonds();
renderPayments();

// --- Checkout (popup + WhatsApp) ---
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');

document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  const userId = document.getElementById('userId')?.value?.trim();
  const serverId = document.getElementById('serverId')?.value?.trim();

  if (!userId || !selectedDiamond || !selectedPayment) {
    alert('Lengkapi data: User ID, paket diamond, dan metode pembayaran.');
    return;
  }

  let detail = `Game: ${gameName}\nUser ID: ${userId}`;
  if (serverId) detail += `\nServer ID: ${serverId}`;
  detail += `\nPaket: ${selectedDiamond.name} — ${selectedDiamond.price}`;
  detail += `\nPembayaran: ${selectedPayment.name} (${selectedPayment.price})`;

  popupText.textContent = detail;
  popup.classList.add('active');
});

document.getElementById('confirmBtn')?.addEventListener('click', () => {
  const message = encodeURIComponent(popupText.textContent || '');
  const waNumber = '6282298902274'; // Ganti ke nomor admin
  window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  popup.classList.remove('active');
});

// Tutup popup bila klik area luar
popup?.addEventListener('click', (e) => {
  if (e.target === popup) popup.classList.remove('active');
});
