// DATA GAME
const games = [
  {id:'ff', name:'Free Fire', bg:'https://files.catbox.moe/oqnxag.jpeg', logo:'https://files.catbox.moe/oqnxag.jpeg'},
  {id:'ml', name:'Mobile Legends', bg:'https://files.catbox.moe/h7whee.jpeg', logo:'https://files.catbox.moe/h7whee.jpeg'},
  {id:'hok', name:'Honor of Kings', bg:'https://files.catbox.moe/04zakl.jpeg', logo:'https://files.catbox.moe/04zakl.jpeg'},
  {id:'roblox', name:'Roblox', bg:'https://files.catbox.moe/ldegjz.png', logo:'https://files.catbox.moe/ldegjz.png'}
];

// DATA PAKET
const harga = {
  ff: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000,"720 Diamonds":90000,"1450 Diamonds":180000,"3000 Diamonds":350000},
  ml: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000,"706 Diamonds":160000,"1000 Diamonds":220000,"2000 Diamonds":400000},
  hok: {"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000,"1200 Tokens":210000,"2500 Tokens":400000},
  roblox: {"80 Robux":12000,"400 Robux":60000,"800 Robux":115000,"1700 Robux":230000,"4000 Robux":500000}
};

// DATA PAYMENT
const payments = [
  {id:'gopay', name:'GoPay', img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'dana', name:'Dana', img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'ovo', name:'OVO', img:'https://files.catbox.moe/0qmbo6.jpg'}
];

// SELECTED ITEMS
let selectedGame = null;
let selectedPackage = null;
let selectedPayment = null;

// PARTICLE CANVAS
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// POPUP LOADER
const popup = document.getElementById('popup');
function showPopup() { popup.classList.add('active'); }
function hidePopup() { popup.classList.remove('active'); }

// GENERATE GAME CARDS
const gameGrid = document.getElementById('gameGrid');
games.forEach(game => {
  const div = document.createElement('div');
  div.className = 'game-card';
  div.style.background = `url(${game.bg}) center/cover no-repeat`;
  div.innerHTML = `<div class="overlay"></div><img src="${game.logo}"><div>${game.name}</div>`;
  div.addEventListener('click', ()=>{
    document.querySelectorAll('.game-card').forEach(g=>g.classList.remove('selected'));
    div.classList.add('selected');
    selectedGame = game.id;
    generatePackages(selectedGame);
    createParticles(div.offsetLeft+div.offsetWidth/2, div.offsetTop+div.offsetHeight/2, '#ff9800', 20);
  });
  gameGrid.appendChild(div);
  setTimeout(()=>div.classList.add('visible'),100);
});

// GENERATE PACKAGES
const packageGrid = document.getElementById('packageGrid');
function generatePackages(gameId){
  packageGrid.innerHTML = '';
  const packs = harga[gameId];
  Object.keys(packs).forEach(key => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="pkg-name">${key}</div>
          <div class="pkg-price">Rp ${packs[key].toLocaleString()}</div>
        </div>
        <div class="flip-card-back">Pilih Paket</div>
      </div>`;
    card.addEventListener('click', ()=>{
      document.querySelectorAll('.flip-card').forEach(f=>f.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackage = key;
      updatePrice();
      createParticles(card.offsetLeft+card.offsetWidth/2, card.offsetTop+card.offsetHeight/2, '#ff9800', 25);
    });
    packageGrid.appendChild(card);
    setTimeout(()=>card.classList.add('visible'),100);
  });
}

// GENERATE PAYMENT OPTIONS
const paymentGrid = document.getElementById('paymentGrid');
payments.forEach(p=>{
  const div = document.createElement('div');
  div.className = 'payment-option';
  div.innerHTML = `<img src="${p.img}"><div>${p.name}</div>`;
  div.addEventListener('click', ()=>{
    document.querySelectorAll('.payment-option').forEach(pg=>pg.classList.remove('selected'));
    div.classList.add('selected');
    selectedPayment = p.name;
    createParticles(div.offsetLeft+div.offsetWidth/2, div.offsetTop+div.offsetHeight/2, '#ff5722', 20);
  });
  paymentGrid.appendChild(div);
});

// UPDATE PRICE
function updatePrice(){
  if(!selectedGame || !selectedPackage) return;
  let total = harga[selectedGame][selectedPackage];
  const voucher = document.getElementById('voucher').value.trim();
  if(voucher.toUpperCase() === 'PROMO10') total *= 0.9;
  document.getElementById('stickyPrice').textContent = "Total: Rp " + total.toLocaleString();
}

// PARTICLE EFFECT
function createParticles(x, y, color, count){
  const particles = [];
  for(let i=0;i<count;i++){
    particles.push({
      x:x, y:y,
      radius: Math.random()*4+2,
      color: color,
      dx: (Math.random()-0.5)*4,
      dy: (Math.random()-0.5)*4,
      alpha:1
    });
  }
  let animId;
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.02;
      if(p.alpha<0) p.alpha = 0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });
    if(particles.every(p=>p.alpha<=0)){
      cancelAnimationFrame(animId);
      ctx.clearRect(0,0,canvas.width,canvas.height);
    } else {
      animId = requestAnimationFrame(animate);
    }
  }
  animate();
}

// VOUCHER INPUT
document.getElementById('voucher').addEventListener('input', updatePrice);

// CHECKOUT BUTTON
const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', ()=>{
  const uid = document.getElementById('idgame').value.trim();
  const voucher = document.getElementById('voucher').value.trim();
  if(!selectedGame || !selectedPackage || !selectedPayment || !uid){
    alert("Silakan pilih semua: game, paket, payment, dan masukkan ID Game.");
    return;
  }
  const total = harga[selectedGame][selectedPackage]*(voucher.toUpperCase()==='PROMO10'?0.9:1);
  const msg = `Halo Admin, saya ingin top up:\nGame: ${selectedGame}\nID: ${uid}\nPaket: ${selectedPackage}\nPayment: ${selectedPayment}\nHarga: Rp ${total.toLocaleString()}`;

  showPopup();
  createParticles(checkoutBtn.offsetLeft+checkoutBtn.offsetWidth/2, checkoutBtn.offsetTop+checkoutBtn.offsetHeight/2, '#ff5722',50);

  setTimeout(()=>{
    hidePopup();
    const waUrl = `https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  },1500);
});
