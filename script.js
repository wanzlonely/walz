const games = [
  {id:'ff', name:'Free Fire', logo:'https://files.catbox.moe/oqnxag.jpeg', packs: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000}},
  {id:'ml', name:'Mobile Legends', logo:'https://files.catbox.moe/h7whee.jpeg', packs: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000}},
  {id:'hok', name:'Honor of Kings', logo:'https://files.catbox.moe/04zakl.jpeg', packs: {"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000}},
  {id:'roblox', name:'Roblox', logo:'https://files.catbox.moe/ldegjz.png', packs: {"80 Robux":12000,"400 Robux":60000,"800 Robux":115000}}
];

const payments = [
  {id:'gopay', name:'GoPay', img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'dana', name:'Dana', img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'shopeepay', name:'ShopeePay', img:'https://files.catbox.moe/gub7ik.jpg'}
];

let selectedGame=null, selectedPackage=null, selectedPayment=null;

// Render Games
const gameGrid = document.getElementById('gameGrid');
const checkoutCard = document.getElementById('checkoutCard');
games.forEach(g=>{
  const div=document.createElement('div');
  div.className='game-card';
  div.innerHTML=`<img src="${g.logo}" width="80"><div>${g.name}</div>`;
  div.onclick=()=>{
    document.querySelectorAll('.game-card').forEach(gc=>gc.classList.remove('selected'));
    div.classList.add('selected');
    selectedGame=g;
    checkoutCard.style.display='block';
    document.getElementById('selectedGameName').textContent=g.name;
    if(g.id==='ml') document.getElementById('serverContainer').style.display='block';
    else document.getElementById('serverContainer').style.display='none';
    generatePackages(g.packs);
  };
  gameGrid.appendChild(div);
});

// Generate Packages
function generatePackages(packs){
  const packageGrid = document.getElementById('packageGrid');
  packageGrid.innerHTML='';
  Object.keys(packs).forEach(p=>{
    const card = document.createElement('div');
    card.className='package-card';
    card.innerHTML=`<div>${p}</div><div>Rp ${packs[p].toLocaleString()}</div>`;
    card.onclick=()=>{
      document.querySelectorAll('.package-card').forEach(pc=>pc.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackage={name:p, price:packs[p]};
      updateTotal();
    };
    packageGrid.appendChild(card);
  });
}

// Render Payments
const paymentGrid=document.getElementById('paymentGrid');
payments.forEach(p=>{
  const div=document.createElement('div');
  div.className='payment-option';
  div.innerHTML=`<img src="${p.img}"><div>${p.name}</div>`;
  div.onclick=()=>{
    document.querySelectorAll('.payment-option').forEach(po=>po.classList.remove('selected'));
    div.classList.add('selected');
    selectedPayment=p.name;
  };
  paymentGrid.appendChild(div);
});

// Voucher
document.getElementById('voucherInput').addEventListener('input',updateTotal);

// Update Total
function updateTotal(){
  if(!selectedPackage) return;
  let total=selectedPackage.price;
  const voucher=document.getElementById('voucherInput').value.trim().toUpperCase();
  if(voucher==='PROMO10') total*=0.9;
  if(voucher==='HEMAT20') total*=0.8;
  document.getElementById('stickyPrice').textContent="Total: Rp "+total.toLocaleString();
}

// Checkout
document.getElementById('checkoutBtn').onclick=()=>{
  const uid=document.getElementById('idgame').value.trim();
  const server=document.getElementById('serverId').value.trim();
  if(!selectedGame||!selectedPackage||!selectedPayment||!uid){
    alert("Lengkapi semua data sebelum checkout!");
    return;
  }
  let total=selectedPackage.price;
  const voucher=document.getElementById('voucherInput').value.trim().toUpperCase();
  if(voucher==='PROMO10') total*=0.9;
  if(voucher==='HEMAT20') total*=0.8;
  let msg=`Halo Admin, saya ingin top up:\nGame: ${selectedGame.name}\nID: ${uid}`;
  if(selectedGame.id==='ml' && server) msg+=`\nServer: ${server}`;
  msg+=`\nProduk: ${selectedPackage.name}\nPayment: ${selectedPayment}\nTotal: Rp ${total.toLocaleString()}`;
  alert(msg);
};