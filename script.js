// === DATA GAME ===
const games = [
  { id:'ff',  name:'Free Fire',       theme:'theme-ff',
    bg:'https://files.catbox.moe/oqnxag.jpeg', logo:'https://files.catbox.moe/oqnxag.jpeg' },
  { id:'ml',  name:'Mobile Legends',  theme:'theme-ml',
    bg:'https://files.catbox.moe/h7whee.jpeg', logo:'https://files.catbox.moe/h7whee.jpeg' },
  { id:'hok', name:'Honor of Kings',  theme:'theme-hok',
    bg:'https://files.catbox.moe/04zakl.jpeg', logo:'https://files.catbox.moe/04zakl.jpeg' },
  { id:'roblox', name:'Roblox',       theme:'theme-roblox',
    bg:'https://files.catbox.moe/ldegjz.png',  logo:'https://files.catbox.moe/ldegjz.png' }
];

// === DATA PAKET (distribusi untuk filter Hemat/Mid/Sultan) ===
const harga = {
  ff: {
    "70 Diamonds": 9000, "140 Diamonds":18000, "355 Diamonds":45000, "720 Diamonds":90000,
    "1450 Diamonds":180000, "3000 Diamonds":350000
  },
  ml: {
    "86 Diamonds":23000, "172 Diamonds":45000, "514 Diamonds":120000, "706 Diamonds":160000,
    "1000 Diamonds":220000, "2000 Diamonds":400000
  },
  hok: {
    "80 Tokens":14000, "240 Tokens":44000, "560 Tokens":100000, "1200 Tokens":210000, "2500 Tokens":400000
  },
  roblox: {
    "80 Robux":12000, "400 Robux":60000, "800 Robux":115000, "1700 Robux":230000, "4000 Robux":500000
  }
};

// === DATA PAYMENT ===
const payments = [
  { id:'gopay',     name:'GoPay',      img:'https://files.catbox.moe/7f7kj6.png' },
  { id:'dana',      name:'Dana',       img:'https://files.catbox.moe/9ozprx.jpg' },
  { id:'shopeepay', name:'ShopeePay',  img:'https://files.catbox.moe/gub7ik.jpg' },
  { id:'qris',      name:'QRIS',       img:'https://files.catbox.moe/crlcvj.jpg' }
];

// === VOUCHER ala Shopee ===
const vouchers = [
  { code:'PROMO10', title:'Diskon 10%',   badge:'BEST',  exp:'2025-12-31', type:'disc', value:0.10 },
  { code:'HEMAT5',  title:'Potongan 5K',  badge:'HEMAT', exp:'2025-12-31', type:'subs', value:5000 },
  { code:'WLZSPR',  title:'Spesial 10%',  badge:'NEW',   exp:'2025-12-31', type:'disc', value:0.10 },
];

// === STATE ===
let selectedGame = null;
let selectedPackage = null;
let selectedPayment = null;
let activeVoucher = null;

// === ELEMENTS ===
const gameGrid = document.getElementById('gameGrid');
const userSection = document.getElementById('userSection');
const serverInput = document.getElementById('serverid');
const packageSection = document.getElementById('packageSection');
const packageGrid  = document.getElementById('packageGrid');
const packageFilter = document.getElementById('packageFilter');
const paymentSection = document.getElementById('paymentSection');
const paymentGrid   = document.getElementById('paymentGrid');
const voucherSection = document.getElementById('voucherSection');
const voucherStrip   = document.getElementById('voucherStrip');
const stickyBar   = document.getElementById('stickyBar');
const summaryGame = document.getElementById('summaryGame');
const summaryPack = document.getElementById('summaryPack');
const summaryPay  = document.getElementById('summaryPay');
const stickyPrice = document.getElementById('stickyPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const toastEl     = document.getElementById('toast');

// === HELPERS ===
const reveal = (node)=>{ node.classList.add('reveal'); setTimeout(()=>node.classList.add('show'), 20); };
const money = (n)=>"Rp "+(n||0).toLocaleString('id-ID');

function showToast(msg="Berhasil"){
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  requestAnimationFrame(()=>toastEl.classList.add('show'));
  setTimeout(()=>{
    toastEl.classList.remove('show');
    setTimeout(()=>toastEl.classList.add('hidden'), 250);
  }, 1700);
}

function setTheme(themeClass){
  const body = document.body;
  body.classList.remove('theme-default','theme-ff','theme-ml','theme-hok','theme-roblox');
  body.classList.add(themeClass || 'theme-default');
}

// === RENDER GAME ===
games.forEach(g=>{
  const card = document.createElement('div');
  card.className = 'game-card';
  card.innerHTML = `
    <div class="game-thumb" style="background-image:url('${g.bg}')"></div>
    <div class="game-mask"></div>
    <div class="game-meta">
      <img class="game-logo" src="${g.logo}" alt="${g.name}"/>
      <div class="game-name">${g.name}</div>
    </div>
  `;
  card.addEventListener('click', ()=>{
    document.querySelectorAll('.game-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');

    selectedGame = g.id;
    selectedPackage = null;
    selectedPayment = null;
    activeVoucher = null;

    setTheme(g.theme);
    userSection.classList.remove('hidden');
    packageSection.classList.remove('hidden');
    paymentSection.classList.add('hidden');
    voucherSection.classList.add('hidden');
    stickyBar.classList.add('hidden');

    serverInput.classList.toggle('hidden', !(g.id === 'ml'));
    document.getElementById('idgame').focus();

    renderPackages(g.id);
    summaryGame.innerHTML = `Game: <b>${g.name}</b>`;
    summaryPack.innerHTML = "Paket: -";
    summaryPay.innerHTML  = "Pembayaran: -";
    stickyPrice.textContent = money(0);
  });
  gameGrid.appendChild(card);
  reveal(card);
});

// === KATEGORI PAKET berdasarkan harga ===
function bucket(price){
  if(price <= 45000) return 'low';
  if(price <= 180000) return 'mid';
  return 'high';
}

// === RENDER PACKAGES ===
function renderPackages(gameId){
  packageGrid.innerHTML = '';
  const packs = harga[gameId] || {};
  const entries = Object.entries(packs);

  // tampilkan filter
  packageFilter.classList.remove('hidden');
  packageFilter.querySelectorAll('.chip').forEach(ch=>{
    ch.classList.remove('chip-active');
    if(ch.dataset.size === 'all') ch.classList.add('chip-active');
    ch.onclick = ()=>{
      packageFilter.querySelectorAll('.chip').forEach(x=>x.classList.remove('chip-active'));
      ch.classList.add('chip-active');
      paint(entries, ch.dataset.size);
    };
  });

  function paint(list, size='all'){
    packageGrid.innerHTML = '';
    list.forEach(([name, price])=>{
      if(size !== 'all' && bucket(price) !== size) return;
      const node = document.createElement('div');
      node.className = 'pkg reveal';
      node.innerHTML = `
        <div class="pkg-top">
          <span class="diamond"></span>
          <div class="pkg-name">${name}</div>
        </div>
        <div class="pkg-price">${money(price)}</div>
      `;
      node.addEventListener('click', ()=>{
        document.querySelectorAll('.pkg').forEach(p=>p.classList.remove('selected'));
        node.classList.add('selected');
        selectedPackage = name;

        paymentSection.classList.remove('hidden');
        voucherSection.classList.remove('hidden');
        stickyBar.classList.remove('hidden');

        summaryPack.innerHTML = `Paket: <b>${name}</b>`;
        updatePrice();
      });
      packageGrid.appendChild(node);
      requestAnimationFrame(()=>node.classList.add('show'));
    });
  }

  paint(entries, 'all');
}

// === RENDER PAYMENTS ===
function renderPayments(total){
  paymentGrid.innerHTML = '';
  payments.forEach(p=>{
    const row = document.createElement('div');
    row.className = 'pay reveal';
    row.innerHTML = `
      <img src="${p.img}" alt="${p.name}"/>
      <div class="pay-name">${p.name}</div>
      <div class="pay-right">${money(total || 0)}</div>
    `;
    row.addEventListener('click', ()=>{
      document.querySelectorAll('.pay').forEach(el=>el.classList.remove('selected'));
      row.classList.add('selected');
      selectedPayment = p.name;
      summaryPay.innerHTML = `Pembayaran: <b>${p.name}</b>`;
    });
    paymentGrid.appendChild(row);
    requestAnimationFrame(()=>row.classList.add('show'));
  });
}

// === RENDER VOUCHER STRIP ===
function renderVouchers(){
  voucherStrip.innerHTML = '';
  const now = new Date();
  vouchers.forEach(v=>{
    const exp = new Date(v.exp);
    if(exp < now) return;
    const card = document.createElement('div');
    card.className = 'voucher reveal';
    card.innerHTML = `
      <span class="v-badge">${v.badge}</span>
      <div>
        <div class="v-title">${v.title}</div>
        <div class="v-exp">Berlaku s/d ${v.exp}</div>
      </div>
    `;
    card.addEventListener('click', ()=>{
      document.querySelectorAll('.voucher').forEach(x=>x.classList.remove('active'));
      card.classList.add('active');
      activeVoucher = v;
      updatePrice();
      showToast(`Voucher ${v.title} aktif`);
    });
    voucherStrip.appendChild(card);
    requestAnimationFrame(()=>card.classList.add('show'));
  });
}
renderVouchers();

// === HITUNG TOTAL ===
function getTotal(){
  if(!selectedGame || !selectedPackage) return 0;
  const base = harga[selectedGame][selectedPackage] || 0;
  if(!activeVoucher) return base;

  if(activeVoucher.type === 'disc'){
    return Math.max(0, Math.round(base * (1 - activeVoucher.value)));
  }
  if(activeVoucher.type === 'subs'){
    return Math.max(0, base - activeVoucher.value);
  }
  return base;
}

function updatePrice(){
  const total = getTotal();
  stickyPrice.textContent = money(total);
  renderPayments(total); // refresh angka di kanan kartu payment
}

// === CHECKOUT ===
checkoutBtn.addEventListener('click', ()=>{
  const uid = document.getElementById('idgame').value.trim();
  if(!selectedGame || !selectedPackage || !selectedPayment || !uid){
    alert("Lengkapi pilihan: game, paket, pembayaran, dan isi ID/UID.");
    return;
  }
  const gameObj = games.find(g=>g.id === selectedGame);
  let finalId = uid;

  if(selectedGame === 'ml'){
    const sid = (document.getElementById('serverid').value || '').trim();
    if(!sid){ alert("Masukkan juga Server ID untuk Mobile Legends."); return; }
    finalId = `${uid} (${sid})`;
  }

  const total = getTotal();
  const voucherText = activeVoucher ? `${activeVoucher.title} (${activeVoucher.code})` : "-";

  const msg =
`Halo Admin, saya ingin top up:
Game: ${gameObj ? gameObj.name : selectedGame}
ID: ${finalId}
Paket: ${selectedPackage}
Payment: ${selectedPayment}
Voucher: ${voucherText}
Total Harga: ${money(total)}`;

  const wa = `https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`;
  window.open(wa, "_blank");
});

// === SMALL INTERACTIONS ===
document.querySelectorAll('.section').forEach(s=>reveal(s));
