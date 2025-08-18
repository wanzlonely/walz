/* ===========================
   DATA
=========================== */
const games = [
  {id:'ff',  name:'Free Fire',       bg:'https://files.catbox.moe/oqnxag.jpeg', logo:'https://files.catbox.moe/oqnxag.jpeg', theme:'fire'},
  {id:'ml',  name:'Mobile Legends',  bg:'https://files.catbox.moe/h7whee.jpeg',  logo:'https://files.catbox.moe/h7whee.jpeg',  theme:'neon'},
  {id:'hok', name:'Honor of Kings',  bg:'https://files.catbox.moe/04zakl.jpeg',  logo:'https://files.catbox.moe/04zakl.jpeg',  theme:'gold'},
  {id:'roblox', name:'Roblox',       bg:'https://files.catbox.moe/ldegjz.png',   logo:'https://files.catbox.moe/ldegjz.png',   theme:'pixel'}
];

const harga = {
  ff: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000,"720 Diamonds":90000,"1450 Diamonds":180000,"3000 Diamonds":350000},
  ml: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000,"706 Diamonds":160000,"1000 Diamonds":220000,"2000 Diamonds":400000},
  hok: {"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000,"1200 Tokens":210000,"2500 Tokens":400000},
  roblox: {"80 Robux":12000,"400 Robux":60000,"800 Robux":115000,"1700 Robux":230000,"4000 Robux":500000}
};

const diamondIcon = "https://cdn-icons-png.flaticon.com/512/2907/2907253.png";

const ewallets = [
  {id:'shopee', name:'ShopeePay', img:'https://files.catbox.moe/gub7ik.jpg'},
  {id:'dana',   name:'DANA',      img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'gopay',  name:'GoPay',     img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'qris',   name:'QRIS',      img:'https://files.catbox.moe/crlcvj.jpg'}
];

const vouchers = [
  { code:"WLZSPR", desc:"Diskon spesial 10%", exp:"2025-12-31", discount:0.10, min:20000, only:null },
  { code:"PROMO10", desc:"Diskon 10%",        exp:"2024-12-31", discount:0.10, min:0,     only:null },
  { code:"MLHEMAT", desc:"MLBB khusus 12%",   exp:"2026-01-01", discount:0.12, min:30000, only:"ml" }
];

/* ===========================
   STATE
=========================== */
let selectedGame=null, selectedPackage=null, selectedPayment=null;
let spinUsed=false;

/* ===========================
   THEME TOGGLE
=========================== */
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');
if(storedTheme==='dark'){ root.classList.add('dark'); themeBtn.textContent='🌙'; }
themeBtn.addEventListener('click', ()=>{
  root.classList.toggle('dark');
  const dark = root.classList.contains('dark');
  themeBtn.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme', dark?'dark':'light');
});

/* ===========================
   HERO BACKGROUND ANIM
   (berbeda sesuai game)
=========================== */
const hero = document.getElementById('hero');
const bg = document.getElementById('bgAnim');
const g = bg.getContext('2d');
function resizeHero(){ bg.width = hero.clientWidth; bg.height = hero.clientHeight; }
window.addEventListener('resize', resizeHero); resizeHero();

let t=0, currentTheme='neon';
function drawHero(){
  g.clearRect(0,0,bg.width,bg.height);
  if(currentTheme==='fire'){
    // Fire particles
    for(let i=0;i<80;i++){
      const x = Math.sin((i+t*0.03))*bg.width*0.5 + bg.width/2;
      const y = bg.height - (i*7 + (Math.sin(t*0.06+i)*20));
      const r = 2 + (i%5);
      g.fillStyle = `hsla(${30+ i%30},90%,55%,.15)`;
      g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
    }
  }else if(currentTheme==='neon'){
    // Neon waves
    for(let y=0;y<6;y++){
      g.beginPath();
      for(let x=0;x<=bg.width;x+=20){
        const yy = Math.sin((x*0.01)+t*0.04 + y)*14 + (bg.height/2 + y*14 - 40);
        if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy);
      }
      g.strokeStyle=`hsla(${200+y*8},80%,60%,.45)`; g.lineWidth=2; g.stroke();
    }
  }else if(currentTheme==='gold'){
    // Golden sparks
    for(let i=0;i<90;i++){
      const x = (i*17+t*1.5)%bg.width;
      const y = (Math.sin(i*0.3+t*0.06)*0.4+0.5)*bg.height;
      g.fillStyle='rgba(255,215,130,.18)';
      g.fillRect(x,y,3,12);
    }
  }else if(currentTheme==='pixel'){
    // Pixel rain
    for(let i=0;i<70;i++){
      const x = (i*21 + t*2) % bg.width;
      const y = ((i*13 + t*3) % bg.height);
      g.fillStyle='rgba(120,200,255,.25)';
      g.fillRect(x,y,6,6);
    }
  }
  t++; requestAnimationFrame(drawHero);
}
drawHero();

/* ===========================
   GAME RENDER
=========================== */
const gameGrid = document.getElementById('gameGrid');
games.forEach(game=>{
  const card = document.createElement('div');
  card.className='game-card';
  card.style.backgroundImage=`url(${game.bg})`;
  card.innerHTML = `<img src="${game.logo}" alt="${game.name}"><div>${game.name}</div>`;
  card.addEventListener('click', ()=>{
    document.querySelectorAll('.game-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    selectedGame = game.id;
    selectedPackage = null;
    selectedPayment = null;
    // theme hero
    currentTheme = game.theme;
    // ML server field
    const serverInput = document.getElementById('serverid');
    const serverLabel = document.getElementById('serverLabel');
    if(game.id === 'ml'){ serverInput.classList.remove('hidden'); serverLabel.classList.remove('hidden'); }
    else { serverInput.classList.add('hidden'); serverLabel.classList.add('hidden'); serverInput.value=''; }
    generatePackages(game.id);
    updatePrice();
  });
  gameGrid.appendChild(card);
});

/* ===========================
   PACKAGE RENDER
=========================== */
const packageGrid = document.getElementById('packageGrid');
function generatePackages(gameId){
  packageGrid.innerHTML='';
  const packs = harga[gameId]||{};
  const labels = ['Best Seller','Hemat','Favorit'];

  Object.keys(packs).forEach((name, idx)=>{
    const card = document.createElement('div');
    card.className = 'package-card';
    const badge = idx<3 ? `<div class="badge">${labels[idx]}</div>` : '';
    card.innerHTML = `
      ${badge}
      <div class="pkg-top">
        <img src="${diamondIcon}" alt="diamond" />
        <div class="pkg-name">${name}</div>
      </div>
      <div class="pkg-price">Rp ${packs[name].toLocaleString()}</div>
    `;
    card.addEventListener('click', ()=>{
      document.querySelectorAll('.package-card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackage = name;
      selectedPayment = null;
      updatePrice();
    });
    packageGrid.appendChild(card);
  });
}

/* ===========================
   PAYMENT RENDER
=========================== */
const paymentGrid = document.getElementById('paymentGrid');
function renderPayments(){
  paymentGrid.innerHTML='';
  ewallets.forEach(p=>{
    const div = document.createElement('div');
    div.className='payment-option';
    div.innerHTML = `<img src="${p.img}" alt="${p.name}"><div>${p.name}</div>`;
    div.addEventListener('click', ()=>{
      document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));
      div.classList.add('selected');
      selectedPayment = p.name;
      updatePrice();
    });
    paymentGrid.appendChild(div);
  });
}
renderPayments();

/* ===========================
   VOUCHER SHELF (Shopee-like)
=========================== */
const voucherShelf = document.getElementById('voucherShelf');
function renderVoucherShelf(){
  voucherShelf.innerHTML='';
  const now = new Date();
  vouchers.forEach(v=>{
    const expired = new Date(v.exp) < now;
    const disable = expired ? 'disabled' : '';
    const onlyTxt = v.only ? `• Khusus ${games.find(g=>g.id===v.only)?.name}` : '';
    const card = document.createElement('div');
    card.className='voucher-card';
    card.innerHTML = `
      <div class="voucher-left"><div class="perc">${Math.round(v.discount*100)}%</div></div>
      <div class="voucher-right">
        <div class="voucher-title">${v.code}</div>
        <div class="voucher-desc">${v.desc} • Min. Rp${v.min.toLocaleString()} ${onlyTxt}</div>
        <div class="voucher-meta">
          <div class="voucher-exp">Exp: ${v.exp}</div>
          <button class="voucher-apply" ${disable}>Pakai</button>
        </div>
      </div>
    `;
    const btn = card.querySelector('.voucher-apply');
    btn.addEventListener('click', ()=>{
      document.getElementById('voucher').value = v.code;
      updatePrice();
      btn.textContent = 'Dipakai ✓';
    });
    voucherShelf.appendChild(card);
  });
}
renderVoucherShelf();
document.getElementById('applyVoucher').addEventListener('click', updatePrice);

/* ===========================
   TOTAL & SUMMARY
=========================== */
function getTotal(){
  if(!selectedGame || !selectedPackage) return 0;
  let total = harga[selectedGame][selectedPackage] || 0;

  // voucher input
  const code = document.getElementById('voucher').value.trim().toUpperCase();
  if(code){
    const now = new Date();
    const v = vouchers.find(x => x.code===code && new Date(x.exp)>=now && total>=x.min && (!x.only || x.only===selectedGame));
    if(v){ total = Math.round(total * (1 - v.discount)); }
  }

  // spin bonus (applied via summaryVoucher if exist)
  const spin = Number(localStorage.getItem('spinDiscount')||0);
  if(spin>0){ total = Math.round(total * (1 - spin)); }

  return total < 0 ? 0 : total;
}

function updatePrice(){
  const subtotalEl = document.getElementById('summarySubtotal');
  const titleEl = document.getElementById('summaryTitle');
  const priceEl = document.getElementById('summaryPrice');
  const voucherEl = document.getElementById('summaryVoucher');

  if(selectedGame && selectedPackage){
    const sub = harga[selectedGame][selectedPackage] || 0;
    titleEl.textContent = selectedPackage;
    subtotalEl.textContent = 'Rp' + sub.toLocaleString();
  }else{
    titleEl.textContent = 'Belum dipilih';
    subtotalEl.textContent = 'Rp0';
  }

  // voucher text
  const parts = [];
  const inputCode = document.getElementById('voucher').value.trim().toUpperCase();
  if(inputCode) parts.push(inputCode);
  const spin = Number(localStorage.getItem('spinDiscount')||0);
  if(spin>0) parts.push(`Spin ${Math.round(spin*100)}%`);
  voucherEl.textContent = parts.length? parts.join(' + ') : '—';

  priceEl.textContent = 'Rp' + (getTotal()).toLocaleString();
}
document.getElementById('voucher').addEventListener('input', updatePrice);

/* ===========================
   NICKNAME MOCK CHECK
=========================== */
document.getElementById('checkNick').addEventListener('click', ()=>{
  const uid = document.getElementById('idgame').value.trim();
  const server = document.getElementById('serverid').value.trim();
  const nickEl = document.getElementById('nickname');
  if(!uid){ nickEl.textContent='Isi ID dulu'; return; }
  // Mock nickname generator (tanpa API)
  const tag = selectedGame ? games.find(g=>g.id===selectedGame)?.name || 'Player' : 'Player';
  const hash = Array.from(uid).reduce((a,c)=>a+c.charCodeAt(0),0)%9999;
  const serverTxt = (selectedGame==='ml' && server) ? ` • S${server}` : '';
  nickEl.textContent = `${tag}#${hash}${serverTxt}`;
});

/* ===========================
   SPIN BONUS (Wheel)
=========================== */
const spinModal = document.getElementById('spinModal');
const openSpin = document.getElementById('openSpin');
const closeSpin = document.getElementById('closeSpin');
openSpin.addEventListener('click', ()=> spinModal.classList.remove('hidden'));
closeSpin.addEventListener('click', ()=> spinModal.classList.add('hidden'));

const wheel = document.getElementById('wheel');
const ctx = wheel.getContext('2d');
const slices = [
  {label:'0%', val:0},
  {label:'5%', val:0.05},
  {label:'10%', val:0.10},
  {label:'0%', val:0},
  {label:'15%', val:0.15},
  {label:'0%', val:0},
  {label:'20%', val:0.20},
  {label:'0%', val:0}
];
function drawWheel(rot=0){
  const R = wheel.width/2;
  ctx.clearRect(0,0,wheel.width,wheel.height);
  ctx.save(); ctx.translate(R,R); ctx.rotate(rot);
  for(let i=0;i<slices.length;i++){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,R,i*(2*Math.PI/slices.length),(i+1)*(2*Math.PI/slices.length));
    ctx.closePath();
    ctx.fillStyle = i%2? 'rgba(255,152,0,0.9)' : 'rgba(58,161,255,0.9)';
    ctx.fill();
    // text
    ctx.save();
    ctx.rotate(i*(2*Math.PI/slices.length)+Math.PI/slices.length);
    ctx.textAlign='center'; ctx.fillStyle='#fff'; ctx.font='bold 18px Poppins';
    ctx.fillText(slices[i].label, R*0.6, 8);
    ctx.restore();
  }
  // pointer
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(wheel.width/2, 0);
  ctx.lineTo(wheel.width/2-10, 18);
  ctx.lineTo(wheel.width/2+10, 18);
  ctx.closePath();
  ctx.fillStyle='#ef4444'; ctx.fill();
}
drawWheel();

document.getElementById('spinBtn').addEventListener('click', ()=>{
  if(spinUsed){ document.getElementById('spinResult').textContent='Kamu sudah menggunakan spin hari ini.'; return; }
  let rot = 0, speed = Math.random()*0.35 + 0.35;
  const slow = setInterval(()=>{
    rot += speed; speed *= 0.985; drawWheel(rot);
    if(speed < 0.01){
      clearInterval(slow);
      const idx = Math.floor(((rot%(2*Math.PI))/(2*Math.PI))*slices.length);
      const sel = slices[(slices.length-idx)%slices.length];
      localStorage.setItem('spinDiscount', sel.val.toString());
      spinUsed = true;
      document.getElementById('spinResult').textContent = sel.val>0 ? `Selamat! Diskon tambahan ${sel.label}` : 'Yah, belum beruntung 😅';
      updatePrice();
    }
  }, 16);
});

/* ===========================
   CHECKOUT
=========================== */
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  const uid = document.getElementById('idgame').value.trim();
  const serverid = document.getElementById('serverid').value.trim();
  const voucher = document.getElementById('voucher').value.trim().toUpperCase();

  if(!selectedGame || !selectedPackage || !selectedPayment || !uid){
    alert("Silakan pilih game, paket, metode pembayaran, dan isi ID.");
    return;
  }
  if(selectedGame==='ml' && !serverid){
    alert("Masukkan Server ID (contoh: 4231) untuk Mobile Legends.");
    return;
  }

  const gameMap = Object.fromEntries(games.map(g=>[g.id,g.name]));
  const finalId = selectedGame==='ml' ? `${uid} (${serverid})` : uid;
  const total = getTotal();

  const msg = `Halo Admin, saya ingin top up:
Game: ${gameMap[selectedGame] || selectedGame.toUpperCase()}
ID: ${finalId}
Paket: ${selectedPackage}
Payment: ${selectedPayment}
Voucher: ${voucher || "-"}
Total Harga: Rp ${total.toLocaleString()}`;

  const waUrl = `https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
});

/* ===========================
   INIT
=========================== */
function initDefault(){
  // pilih game pertama default
  const first = gameGrid.querySelector('.game-card');
  if(first) first.click();
}
initDefault();
updatePrice();
