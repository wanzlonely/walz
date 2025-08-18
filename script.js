// DATA GAME
const games=[
  {id:'ff',name:'Free Fire',logo:'https://files.catbox.moe/oqnxag.jpeg'},
  {id:'ml',name:'Mobile Legends',logo:'https://files.catbox.moe/h7whee.jpeg'},
  {id:'hok',name:'Honor of Kings',logo:'https://files.catbox.moe/04zakl.jpeg'},
  {id:'roblox',name:'Roblox',logo:'https://files.catbox.moe/ldegjz.png'}
];

// DATA PRODUK
const harga={
  ff:{"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000,"720 Diamonds":90000},
  ml:{"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000,"706 Diamonds":160000},
  hok:{"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000},
  roblox:{"80 Robux":12000,"400 Robux":60000,"800 Robux":115000}
};

// DATA PAYMENT
const payments=[
  {id:'gopay',name:'GoPay',img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'dana',name:'Dana',img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'shopeepay',name:'ShopeePay',img:'https://files.catbox.moe/gub7ik.jpg'},
  {id:'qris',name:'QRIS',img:'https://files.catbox.moe/crlcvj.jpg'}
];

// INIT VAR
let selectedGame=null,selectedPackage=null,selectedPayment=null;

// GENERATE GAME
const gameGrid=document.getElementById('gameGrid');
games.forEach(g=>{
  const div=document.createElement('div');
  div.className='game-card';
  div.innerHTML=`<img src="${g.logo}"><div>${g.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.game-card').forEach(x=>x.classList.remove('selected'));
    div.classList.add('selected');selectedGame=g.id;
    generatePackages(g.id);
    document.getElementById('serverid').style.display=(g.id==='ml')?'block':'none';
  });
  gameGrid.appendChild(div);
});

// GENERATE PACKAGE
const packageGrid=document.getElementById('packageGrid');
function generatePackages(gameId){
  packageGrid.innerHTML='';
  const packs=harga[gameId];
  Object.keys(packs).forEach(p=>{
    const div=document.createElement('div');
    div.className='pkg-card';
    div.innerHTML=`<div class="icon">💎</div><div>${p}</div><div>Rp ${packs[p].toLocaleString()}</div>`;
    div.addEventListener('click',()=>{
      document.querySelectorAll('.pkg-card').forEach(x=>x.classList.remove('selected'));
      div.classList.add('selected');selectedPackage=p;updatePrice();
    });
    packageGrid.appendChild(div);
  });
}

// GENERATE PAYMENT
const paymentGrid=document.getElementById('paymentGrid');
payments.forEach(pm=>{
  const div=document.createElement('div');
  div.className='payment-option';
  div.innerHTML=`<img src="${pm.img}"><div>${pm.name}</div>`;
  div.addEventListener('click',()=>{
    document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));
    div.classList.add('selected');selectedPayment=pm.name;
  });
  paymentGrid.appendChild(div);
});

// UPDATE PRICE
function updatePrice(){
  if(!selectedGame||!selectedPackage) return;
  let total=harga[selectedGame][selectedPackage];
  const voucher=document.getElementById('voucher').value.trim();
  if(voucher.toUpperCase()==='PROMO10') total*=0.9;
  document.getElementById('stickyPrice').textContent="Total: Rp "+total.toLocaleString();
}

// VOUCHER INPUT
document.getElementById('voucher').addEventListener('input',updatePrice);

// CHECKOUT
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  const uid=document.getElementById('idgame').value.trim();
  const server=document.getElementById('serverid').value.trim();
  const voucher=document.getElementById('voucher').value.trim();
  if(!selectedGame||!selectedPackage||!selectedPayment||!uid){
    alert("Lengkapi semua data!");return;
  }
  const total=harga[selectedGame][selectedPackage]*(voucher.toUpperCase()==='PROMO10'?0.9:1);
  let msg=`Halo Admin, saya ingin top up:\nGame: ${selectedGame}\nID: ${uid}`;
  if(selectedGame==='ml') msg+=`\nServer: ${server}`;
  msg+=`\nPaket: ${selectedPackage}\nPayment: ${selectedPayment}\nHarga: Rp ${total.toLocaleString()}`;
  alert(msg);
});
