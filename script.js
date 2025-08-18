// DATA GAME
const games = [
  {id:'ff',name:'Free Fire',bg:'https://files.catbox.moe/oqnxag.jpeg',logo:'https://files.catbox.moe/oqnxag.jpeg'},
  {id:'ml',name:'Mobile Legends',bg:'https://files.catbox.moe/h7whee.jpeg',logo:'https://files.catbox.moe/h7whee.jpeg'},
  {id:'hok',name:'Honor of Kings',bg:'https://files.catbox.moe/04zakl.jpeg',logo:'https://files.catbox.moe/04zakl.jpeg'},
  {id:'roblox',name:'Roblox',bg:'https://files.catbox.moe/ldegjz.png',logo:'https://files.catbox.moe/ldegjz.png'}
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
  {id:'gopay',name:'GoPay',img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'dana',name:'Dana',img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'shopeepay',name:'ShopeePay',img:'https://files.catbox.moe/gub7ik.jpg'},
  {id:'qris',name:'QRIS',img:'https://files.catbox.moe/crlcvj.jpg'}
];

// GENERATE GAME
const gameGrid=document.getElementById('gameGrid');
let selectedGame=null;
games.forEach(game=>{
  const div=document.createElement('div');
  div.className='game-card';
  div.style.background=`url(${game.bg}) center/cover no-repeat`;
  div.innerHTML=`<div class="overlay"></div><img src="${game.logo}"><div>${game.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.game-card').forEach(g=>g.classList.remove('selected'));
    div.classList.add('selected');
    selectedGame=game.id;
    generatePackages(selectedGame);

    // Show Server ID khusus ML
    if(selectedGame==="ml"){
      document.getElementById('serverIdContainer').style.display="block";
    } else {
      document.getElementById('serverIdContainer').style.display="none";
    }
  });
  gameGrid.appendChild(div);
});

// GENERATE PACKAGES
const packageGrid=document.getElementById('packageGrid');
let selectedPackage=null;
function generatePackages(gameId){
  packageGrid.innerHTML='';
  const packs=harga[gameId];
  Object.keys(packs).forEach(key=>{
    const card=document.createElement('div');
    card.className='package-card';
    card.innerHTML=`<div><img src="https://cdn-icons-png.flaticon.com/512/854/854878.png"> ${key}</div><div>Rp ${packs[key].toLocaleString()}</div>`;
    card.addEventListener('click',()=>{
      document.querySelectorAll('.package-card').forEach(f=>f.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackage=key;
      updatePrice();
    });
    packageGrid.appendChild(card);
  });
}

// PAYMENT
const paymentGrid=document.getElementById('paymentGrid');
let selectedPayment=null;
payments.forEach(p=>{
  const div=document.createElement('div');
  div.className='payment-option';
  div.innerHTML=`<img src="${p.img}"><div>${p.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.payment-option').forEach(pg=>pg.classList.remove('selected'));
    div.classList.add('selected');
    selectedPayment=p.name;
  });
  paymentGrid.appendChild(div);
});

// VOUCHER
const voucherList=document.getElementById('voucherList');
voucherList.querySelectorAll('.voucher').forEach(v=>{
  v.addEventListener('click',()=>{
    document.getElementById('voucher').value=v.dataset.code;
    updatePrice();
  });
});

// UPDATE PRICE
function updatePrice(){
  if(!selectedGame||!selectedPackage) return;
  let total=harga[selectedGame][selectedPackage];
  const voucher=document.getElementById('voucher').value.trim();
  if(voucher.toUpperCase()==='PROMO10') total*=0.9;
  if(voucher.toUpperCase()==='VIP20') total*=0.8;
  document.getElementById('stickyPrice').textContent="Total: Rp "+total.toLocaleString();
}

// CHECKOUT
const checkoutBtn=document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click',()=>{
  const uid=document.getElementById('idgame').value.trim();
  const serverid=document.getElementById('serverid')?document.getElementById('serverid').value.trim():"";
  const voucher=document.getElementById('voucher').value.trim();
  if(!selectedGame||!selectedPackage||!selectedPayment||!uid){
    alert("Silakan pilih semua: game, paket, payment, dan masukkan ID Game.");
    return;
  }
  let total=harga[selectedGame][selectedPackage];
  if(voucher.toUpperCase()==='PROMO10') total*=0.9;
  if(voucher.toUpperCase()==='VIP20') total*=0.8;
  
  let msg=`Halo Admin, saya ingin top up:\nGame: ${selectedGame}\nID: ${uid}`;
  if(selectedGame==="ml") msg+=` (Server: ${serverid})`;
  msg+=`\nPaket: ${selectedPackage}\nPayment: ${selectedPayment}\nHarga: Rp ${total.toLocaleString()}`;
  alert(msg);
});
