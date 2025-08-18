// DATA GAME
const games = [
  {id:'ff', name:'Free Fire', logo:'https://files.catbox.moe/oqnxag.jpeg'},
  {id:'ml', name:'Mobile Legends', logo:'https://files.catbox.moe/h7whee.jpeg'},
  {id:'hok', name:'Honor of Kings', logo:'https://files.catbox.moe/04zakl.jpeg'},
  {id:'roblox', name:'Roblox', logo:'https://files.catbox.moe/ldegjz.png'}
];

// DATA PAKET
const harga = {
  ff: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000},
  ml: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000},
  hok: {"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000},
  roblox: {"80 Robux":12000,"400 Robux":60000,"800 Robux":115000}
};

// PAYMENT
const payments = [
  {id:'gopay', name:'GoPay', img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'dana', name:'Dana', img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'shopeepay', name:'ShopeePay', img:'https://files.catbox.moe/gub7ik.jpg'},
  {id:'qris', name:'QRIS', img:'https://files.catbox.moe/crlcvj.jpg'}
];

// VARIABEL
let selectedGame=null, selectedPackage=null, selectedPayment=null;

// GENERATE GAME
const gameGrid=document.getElementById('gameGrid');
games.forEach(g=>{
  const div=document.createElement('div');
  div.className='game-card';
  div.innerHTML=`<img src="${g.logo}" width="80"><div>${g.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.game-card').forEach(gc=>gc.classList.remove('selected'));
    div.classList.add('selected');
    selectedGame=g.id;
    generatePackages(g.id);
    if(g.id==='ml'){
      document.getElementById('serverContainer').style.display='block';
    } else {
      document.getElementById('serverContainer').style.display='none';
    }
  });
  gameGrid.appendChild(div);
});

// GENERATE PAKET
function generatePackages(gameId){
  const packageGrid=document.getElementById('packageGrid');
  packageGrid.innerHTML='';
  const packs=harga[gameId];
  Object.keys(packs).forEach(p=>{
    const card=document.createElement('div');
    card.className='package-card';
    card.innerHTML=`<div>💎 ${p}</div><div>Rp ${packs[p].toLocaleString()}</div>`;
    card.addEventListener('click',()=>{
      document.querySelectorAll('.package-card').forEach(pc=>pc.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackage=p;
      updatePrice();
    });
    packageGrid.appendChild(card);
  });
}

// GENERATE PAYMENT
const paymentGrid=document.getElementById('paymentGrid');
payments.forEach(p=>{
  const div=document.createElement('div');
  div.className='payment-option';
  div.innerHTML=`<img src="${p.img}"><div>${p.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.payment-option').forEach(po=>po.classList.remove('selected'));
    div.classList.add('selected');
    selectedPayment=p.name;
  });
  paymentGrid.appendChild(div);
});

// UPDATE HARGA
function updatePrice(){
  if(!selectedGame || !selectedPackage) return;
  let total=harga[selectedGame][selectedPackage];
  const voucher=document.getElementById('voucherInput').value.trim().toUpperCase();
  if(voucher==='PROMO10') total*=0.9;
  if(voucher==='HEMAT20') total*=0.8;
  document.getElementById('stickyPrice').textContent="Total: Rp "+total.toLocaleString();
}

// VOUCHER
document.querySelectorAll('.voucher-card').forEach(v=>{
  v.addEventListener('click',()=>{
    document.getElementById('voucherInput').value=v.dataset.code;
    updatePrice();
  });
});
document.getElementById('voucherInput').addEventListener('input',updatePrice);

// CHECKOUT
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  const uid=document.getElementById('idgame').value.trim();
  const server=document.getElementById('serverId').value.trim();
  if(!selectedGame||!selectedPackage||!selectedPayment||!uid){
    alert("Lengkapi semua data sebelum checkout!");
    return;
  }
  let total=harga[selectedGame][selectedPackage];
  const voucher=document.getElementById('voucherInput').value.trim().toUpperCase();
  if(voucher==='PROMO10') total*=0.9;
  if(voucher==='HEMAT20') total*=0.8;

  let msg=`Halo Admin, saya ingin top up:\nGame: ${selectedGame}\nID: ${uid}`;
  if(selectedGame==='ml' && server) msg+=`\nServer: ${server}`;
  msg+=`\nProduk: ${selectedPackage}\nPayment: ${selectedPayment}\nTotal: Rp ${total.toLocaleString()}`;
  
  alert(msg);
});
