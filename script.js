// === DATA GAME (pakai asset kamu) ===
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

// === DATA PAYMENT (E-Wallet) ===
const ewallets = [
  {id:'gopay', name:'GoPay', img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'ovo', name:'OVO', img:'https://files.catbox.moe/0qmbo6.jpg'},
  {id:'dana', name:'Dana', img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'shopee', name:'Shopee Pay', img:'https://files.catbox.moe/jwu2or.png'}
];

// ICON per game untuk kartu paket
const gameIcons = {
  ff:"https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
  ml:"https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
  hok:"https://cdn-icons-png.flaticon.com/512/2985/2985150.png",
  roblox:"https://cdn-icons-png.flaticon.com/512/906/906349.png"
};

// === STATE ===
let selectedGame=null, selectedPackage=null, selectedPayment=null;

// === PARTICLE CANVAS ===
const canvas=document.getElementById('particleCanvas');
const ctx=canvas.getContext('2d');
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resizeCanvas(); window.addEventListener('resize',resizeCanvas);

// === POPUP LOADER ===
const popup=document.getElementById('popup');
const showPopup=()=>popup.classList.add('active');
const hidePopup=()=>popup.classList.remove('active');

// === RENDER GAME ===
const gameGrid=document.getElementById('gameGrid');
games.forEach(game=>{
  const div=document.createElement('div');
  div.className='game-card';
  div.style.background=`url(${game.bg}) center/cover no-repeat`;
  div.innerHTML=`<div class="overlay"></div><img src="${game.logo}" alt=""><div>${game.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.game-card').forEach(g=>g.classList.remove('selected'));
    div.classList.add('selected');
    selectedGame=game.id; selectedPackage=null;
    generatePackages(game.id);
    updatePrice(); renderPayments();
    createParticles(div.getBoundingClientRect().left+div.offsetWidth/2, div.getBoundingClientRect().top+div.offsetHeight/2, 24);
  });
  gameGrid.appendChild(div);
});

// === RENDER PAKET ===
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
      <div class="pkg-price">Rp ${packs[name].toLocaleString()}</div>`;
    card.addEventListener('click',()=>{
      document.querySelectorAll('.flip-card').forEach(el=>el.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackage=name;
      updatePrice(); renderPayments();
      createParticles(card.getBoundingClientRect().left+card.offsetWidth/2, card.getBoundingClientRect().top+card.offsetHeight/2, 28);
    });
    packageGrid.appendChild(card);
  });
}

// === RENDER PAYMENTS ===
function renderPayments(){
  const list=document.getElementById('ewalletList');
  list.innerHTML='';
  const total=getTotal(); // total sesuai voucher
  ewallets.forEach(p=>{
    const row=document.createElement('div');
    row.className='payment-item';
    row.innerHTML=`
      <div class="payment-left"><img src="${p.img}" alt="${p.name}"/><span>${p.name}</span></div>
      <div class="payment-right">Rp${total.toLocaleString()}</div>`;
    row.addEventListener('click',()=>{
      document.querySelectorAll('.payment-item').forEach(el=>el.classList.remove('selected'));
      row.classList.add('selected');
      selectedPayment=p.name;
    });
    list.appendChild(row);
  });
}

// === HARGA + VOUCHER ===
function getTotal(){
  if(!selectedGame || !selectedPackage) return 0;
  let total=harga[selectedGame][selectedPackage]||0;
  const code=document.getElementById('voucher').value.trim().toUpperCase();
  if(code==='WLZSPR') total*=0.9; // diskon 10%
  return total;
}
function updatePrice(){
  const total=getTotal();
  document.getElementById('stickyPrice').textContent="Total: Rp "+total.toLocaleString();
  document.getElementById('summaryTitle').textContent=selectedPackage?selectedPackage:"Paket belum dipilih";
  document.getElementById('summarySub').textContent=selectedPayment?`Metode: ${selectedPayment}`:"Silakan pilih metode pembayaran";
  document.getElementById('summaryPrice').textContent="Rp"+total.toLocaleString();
}
document.getElementById('voucher').addEventListener('input',()=>{updatePrice();renderPayments();});

// === PARTIKEL ===
function createParticles(x,y,count){
  const parts=[];
  for(let i=0;i<count;i++){
    parts.push({x,y,r:Math.random()*3+2,dx:(Math.random()-0.5)*5,dy:(Math.random()-0.5)*5,a:1});
  }
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      p.x+=p.dx; p.y+=p.dy; p.a-=0.02;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${Math.max(p.a,0)})`; ctx.fill();
    });
    if(parts.every(p=>p.a<=0)) return;
    requestAnimationFrame(tick);
  }
  tick();
}

// === KONFIRMASI (WhatsApp) ===
document.getElementById('confirmBtn').addEventListener('click',()=>{
  const uid=document.getElementById('idgame').value.trim();
  if(!selectedGame || !selectedPackage){alert("Pilih game & paket dulu.");return;}
  if(!uid){alert("Masukkan ID/UID game.");return;}
  if(!selectedPayment){alert("Pilih metode pembayaran.");return;}

  const total=getTotal();
  const msg=`Halo Admin, saya ingin top up:
Game: ${games.find(g=>g.id===selectedGame).name}
ID: ${uid}
Paket: ${selectedPackage}
Metode: ${selectedPayment}
Harga: Rp ${total.toLocaleString()}
Kode: ${document.getElementById('voucher').value.trim()||'-'}`;

  showPopup();
  setTimeout(()=>{
    hidePopup();
    const wa=`https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`;
    window.open(wa,"_blank");
  },1200);
});

// INIT render awal
renderPayments(); updatePrice();
