// === DATA GAME ===
const games = [
  {id:'ff', name:'Free Fire', bg:'https://files.catbox.moe/oqnxag.jpeg', logo:'https://files.catbox.moe/oqnxag.jpeg'},
  {id:'ml', name:'Mobile Legends', bg:'https://files.catbox.moe/h7whee.jpeg', logo:'https://files.catbox.moe/h7whee.jpeg'},
  {id:'hok', name:'Honor of Kings', bg:'https://files.catbox.moe/04zakl.jpeg', logo:'https://files.catbox.moe/04zakl.jpeg'},
  {id:'roblox', name:'Roblox', bg:'https://files.catbox.moe/ldegjz.png', logo:'https://files.catbox.moe/ldegjz.png'}
];

// === DATA PAKET ===
const harga = {
  ff: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000,"720 Diamonds":90000,"1450 Diamonds":180000,"3000 Diamonds":350000},
  ml: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000,"706 Diamonds":160000,"1000 Diamonds":220000,"2000 Diamonds":400000},
  hok: {"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000,"1200 Tokens":210000,"2500 Tokens":400000},
  roblox: {"80 Robux":12000,"400 Robux":60000,"800 Robux":115000,"1700 Robux":230000,"4000 Robux":500000}
};

// === DATA PAYMENT ===
const ewallets = [
  {id:'gopay', name:'GoPay', img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'dana', name:'Dana', img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'shopee', name:'Shopee Pay', img:'https://files.catbox.moe/gub7ik.jpg'},
  {id:'qris', name:'QRIS', img:'https://files.catbox.moe/crlcvj.jpg'}
];

// === VOUCHERS ===
const vouchers = [
  { code:"WLZSPR", desc:"Diskon 10% spesial", exp:"2025-12-31", discount:0.10 },
  { code:"PROMO10", desc:"Diskon 10%",        exp:"2024-12-31", discount:0.10 }
];

// === ICON per game ===
const gameIcons = {
  ff:"https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
  ml:"https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
  hok:"https://cdn-icons-png.flaticon.com/512/2985/2985150.png",
  roblox:"https://cdn-icons-png.flaticon.com/512/906/906349.png"
};

// === STATE ===
let selectedGame = null;
let selectedPackage = null;
let selectedPayment = null;

// === BUBBLE BACKGROUND ===
const bubbleCanvas = document.getElementById('bubbleCanvas');
const bctx = bubbleCanvas.getContext('2d');
function resizeBubbles(){
  bubbleCanvas.width = window.innerWidth;
  bubbleCanvas.height = window.innerHeight;
}
resizeBubbles();
window.addEventListener('resize', resizeBubbles);

const bubbles = Array.from({length:40}).map(()=>({
  x: Math.random()*window.innerWidth,
  y: window.innerHeight + Math.random()*window.innerHeight,
  r: Math.random()*6 + 2,
  s: Math.random()*0.6 + 0.2,
  drift: (Math.random()-0.5)*0.6
}));
function drawBubbles(){
  bctx.clearRect(0,0,bubbleCanvas.width,bubbleCanvas.height);
  bubbles.forEach(b=>{
    b.y -= b.s;
    b.x += b.drift;
    if(b.y < -20){ b.y = window.innerHeight + 20; b.x = Math.random()*window.innerWidth; }
    const grad = bctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r*2.2);
    grad.addColorStop(0,'rgba(255,255,255,0.18)');
    grad.addColorStop(1,'rgba(255,255,255,0)');
    bctx.fillStyle = grad;
    bctx.beginPath(); bctx.arc(b.x,b.y,b.r*2,0,Math.PI*2); bctx.fill();
  });
  requestAnimationFrame(drawBubbles);
}
drawBubbles();

// === PARTICLES (BURST) ===
const particleCanvas = document.getElementById('particleCanvas');
const pctx = particleCanvas.getContext('2d');
function resizeParticles(){ particleCanvas.width=window.innerWidth; particleCanvas.height=window.innerHeight }
resizeParticles(); window.addEventListener('resize', resizeParticles);

function createParticles(x,y,count=24){
  const parts=[];
  for(let i=0;i<count;i++){
    parts.push({
      x,y,
      r:Math.random()*3+2,
      dx:(Math.random()-0.5)*6,
      dy:(Math.random()-0.5)*6,
      a:1
    });
  }
  function tick(){
    pctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
    parts.forEach(p=>{
      p.x+=p.dx; p.y+=p.dy; p.a-=0.02;
      pctx.beginPath(); pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      pctx.fillStyle=`rgba(255,255,255,${Math.max(p.a,0)})`; pctx.fill();
    });
    if(parts.every(p=>p.a<=0)) return;
    requestAnimationFrame(tick);
  }
  tick();
}

// === POPUP ===
const popup=document.getElementById('popup');
const showPopup=()=>popup.classList.add('active');
const hidePopup=()=>popup.classList.remove('active');

// === GAME RENDER ===
const gameGrid=document.getElementById('gameGrid');
games.forEach(game=>{
  const div=document.createElement('div');
  div.className='game-card';
  div.style.background=`url(${game.bg}) center/cover no-repeat`;
  div.innerHTML=`<div class="overlay"></div><img src="${game.logo}" alt=""><div>${game.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.game-card').forEach(g=>g.classList.remove('selected'));
    div.classList.add('selected');

    selectedGame = game.id;
    selectedPackage = null;
    selectedPayment = null;

    // ML: tampilkan Server ID
    const serverInput = document.getElementById('serverid');
    if(game.id === 'ml'){
      serverInput.classList.remove('hidden');
    } else {
      serverInput.classList.add('hidden');
      serverInput.value = "";
    }

    generatePackages(game.id);
    updatePrice(); // akan reset ringkasan & kosongkan payment list

    const rect = div.getBoundingClientRect();
    createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 28);
  });
  gameGrid.appendChild(div);
});

// === PAKET RENDER ===
const packageGrid=document.getElementById('packageGrid');
function generatePackages(gameId){
  packageGrid.innerHTML='';
  const packs=harga[gameId]||{};
  Object.keys(packs).forEach(name=>{
    const card=document.createElement('div');
    card.className='flip-card';
    card.innerHTML=`
      <img class="pkg-icon" src="${gameIcons[gameId]}" alt="">
      <div class="pkg-name">${name}</div>
      <div class="pkg-price">Rp ${packs[name].toLocaleString()}</div>
    `;
    card.addEventListener('click',()=>{
      document.querySelectorAll('.flip-card').forEach(el=>el.classList.remove('selected'));
      card.classList.add('selected');

      selectedPackage = name;
      selectedPayment = null; // reset payment saat ganti paket
      updatePrice();          // ini juga akan render payment

      const rect = card.getBoundingClientRect();
      createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 30);
    });
    packageGrid.appendChild(card);
  });
}

// === VOUCHER LIST ===
function renderVouchers(){
  const list=document.getElementById('voucherList');
  list.innerHTML='';
  const now=new Date();
  vouchers.forEach(v=>{
    const expDate=new Date(v.exp);
    const expired=expDate<now;
    const item=document.createElement('div');
    item.className='voucher-item '+(expired?'expired':'active');
    item.textContent = `${v.code} — ${v.desc} (exp: ${v.exp})`;
    if(!expired){
      item.addEventListener('click',()=>{
        document.getElementById('voucher').value=v.code;
        updatePrice(); // total & payment refresh
      });
    }
    list.appendChild(item);
  });
}
renderVouchers();

// === PAYMENT RENDER ===
function renderPayments(total=null){
  const list=document.getElementById('ewalletList');
  list.innerHTML='';
  if(!selectedGame || !selectedPackage) return; // hanya setelah paket dipilih
  if(total === null) total = getTotal();

  ewallets.forEach(p=>{
    const row=document.createElement('div');
    row.className='payment-item';
    row.innerHTML=`
      <div class="payment-left">
        <img src="${p.img}" alt="${p.name}"/>
        <span>${p.name}</span>
      </div>
      <div class="payment-right">Rp${total.toLocaleString()}</div>
    `;
    row.addEventListener('click',()=>{
      document.querySelectorAll('.payment-item').forEach(el=>el.classList.remove('selected'));
      row.classList.add('selected');
      selectedPayment=p.name;
      updatePrice(); // perbarui summary
      const rect = row.getBoundingClientRect();
      createParticles(rect.left + rect.width - 30, rect.top + rect.height/2, 24);
    });
    list.appendChild(row);
  });
}

// === TOTAL HARGA ===
function getTotal(){
  if(!selectedGame || !selectedPackage) return 0;
  let total = harga[selectedGame][selectedPackage] || 0;

  const code = document.getElementById('voucher').value.trim().toUpperCase();
  const now = new Date();
  const v = vouchers.find(x => x.code === code && new Date(x.exp) >= now);
  if(v){ total = Math.round(total * (1 - v.discount)); }

  return total;
}

// === RINGKASAN & HARGA ===
function updatePrice(){
  const total = getTotal();
  const summaryTitle = document.getElementById('summaryTitle');
  const summarySub   = document.getElementById('summarySub');
  const summaryPrice = document.getElementById('summaryPrice');

  if(selectedGame && selectedPackage){
    summaryTitle.textContent = selectedPackage;
    summarySub.textContent   = selectedPayment ? `Metode: ${selectedPayment}` : "Pilih metode pembayaran";
    summaryPrice.textContent = "Rp" + total.toLocaleString();
  } else {
    summaryTitle.textContent = "Paket belum dipilih";
    summarySub.textContent   = "Silakan pilih paket & payment";
    summaryPrice.textContent = "Rp0";
  }

  // sinkronkan harga pada list payment
  renderPayments(total);
}

// === CHECKOUT ===
const confirmBtn = document.getElementById('confirmBtn');
confirmBtn.addEventListener('click', ()=>{
  const uid = document.getElementById('idgame').value.trim();
  const serverid = document.getElementById('serverid').value.trim();
  const voucher = document.getElementById('voucher').value.trim().toUpperCase();

  if(!selectedGame || !selectedPackage || !selectedPayment || !uid){
    alert("Silakan pilih game, paket, metode pembayaran, dan isi ID.");
    return;
  }

  // ML: wajib Server ID
  let finalId = uid;
  if(selectedGame === 'ml'){
    if(!serverid){
      alert("Masukkan juga Server ID (contoh: 4231) untuk Mobile Legends");
      return;
    }
    finalId = `${uid} (${serverid})`;
  }

  const total = getTotal();

  // nama game untuk pesan WA
  const gameMap = Object.fromEntries(games.map(g=>[g.id,g.name]));
  const msg = `Halo Admin, saya ingin top up:
Game: ${gameMap[selectedGame] || selectedGame.toUpperCase()}
ID: ${finalId}
Paket: ${selectedPackage}
Payment: ${selectedPayment}
Voucher: ${voucher || "-"}
Total Harga: Rp ${total.toLocaleString()}`;

  showPopup();

  const rect = confirmBtn.getBoundingClientRect();
  createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 42);

  setTimeout(()=>{
    hidePopup();
    const waUrl = `https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  }, 1200);
});

// === LISTENERS ===
document.getElementById('voucher').addEventListener('input', ()=>{ updatePrice(); });
