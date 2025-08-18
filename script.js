// Simple Codashop-like flow (no APIs). Checkout opens WA to 6282298902274
const GAMES = [
  {id:'ff',name:'Free Fire',bg:'https://files.catbox.moe/oqnxag.jpeg'},
  {id:'ml',name:'Mobile Legends',bg:'https://files.catbox.moe/h7whee.jpeg'},
  {id:'hok',name:'Honor of Kings',bg:'https://files.catbox.moe/04zakl.jpeg'},
  {id:'roblox',name:'Roblox',bg:'https://files.catbox.moe/ldegjz.png'}
];

const PRICES = {
  ff: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000,"720 Diamonds":90000},
  ml: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000,"706 Diamonds":160000},
  hok: {"80 Tokens":14000,"240 Tokens":44000,"560 Tokens":100000},
  roblox: {"80 Robux":12000,"400 Robux":60000,"800 Robux":115000}
};

const PAYMENTS = [
  {id:'shopee',name:'ShopeePay',img:'https://files.catbox.moe/gub7ik.jpg'},
  {id:'dana',name:'DANA',img:'https://files.catbox.moe/9ozprx.jpg'},
  {id:'gopay',name:'GoPay',img:'https://files.catbox.moe/7f7kj6.png'},
  {id:'qris',name:'QRIS',img:'https://files.catbox.moe/crlcvj.jpg'}
];

const VOUCHERS = [
  {code:'PROMO10',desc:'Diskon 10%',disc:0.10,exp:'2025-12-31'},
  {code:'MLHEMAT',desc:'ML khusus 12%',disc:0.12,exp:'2026-01-01'}
];

let state = { game:null, pack:null, payment:null, voucher:'' };

const $ = id=>document.getElementById(id);

// render games
const gameGrid = $('gameGrid');
function renderGames(){
  gameGrid.innerHTML='';
  GAMES.forEach(g=>{
    const el = document.createElement('div'); el.className='game-card';
    el.style.backgroundImage = `url(${g.bg})`;
    el.innerHTML = `<div>${g.name}</div>`;
    el.addEventListener('click', ()=>{
      document.querySelectorAll('.game-card').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      state.game = g.id;
      $('step-id').classList.remove('hidden');
      // show server for ML
      if(g.id==='ml'){ $('serverid').classList.remove('hidden'); } else { $('serverid').classList.add('hidden'); $('serverid').value=''; }
      renderPackages(g.id);
      updateSummary();
    });
    gameGrid.appendChild(el);
  });
}
renderGames();

// search game
$('searchGame').addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  const filtered = GAMES.filter(g=>g.name.toLowerCase().includes(q));
  gameGrid.innerHTML=''; filtered.forEach(g=>{ const el = document.createElement('div'); el.className='game-card'; el.style.backgroundImage=`url(${g.bg})`; el.innerHTML=`<div>${g.name}</div>`; el.addEventListener('click', ()=>{ document.querySelectorAll('.game-card').forEach(x=>x.classList.remove('selected')); el.classList.add('selected'); state.game=g.id; $('step-id').classList.remove('hidden'); renderPackages(g.id); updateSummary(); }); gameGrid.appendChild(el); });
});

// render packages
const packageGrid = $('packageGrid');
function renderPackages(gameId){
  packageGrid.innerHTML='';
  const packs = PRICES[gameId]||{};
  Object.keys(packs).forEach((k,i)=>{
    const el = document.createElement('div'); el.className='package-card';
    const badge = i===0?'<div class="badge">Best Seller</div>':'';
    el.innerHTML = badge + `<div class="pkg-top"><img src="https://cdn-icons-png.flaticon.com/512/2907/2907253.png" width="28"><div><div class="pkg-name">${k}</div><div class="pkg-price">Rp ${packs[k].toLocaleString()}</div></div></div>`;
    el.addEventListener('click', ()=>{
      document.querySelectorAll('.package-card').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      state.pack = k;
      $('step-voucher')?.classList?.remove('hidden');
      $('step-pay').classList.remove('hidden');
      $('summary').classList.remove('hidden');
      updateSummary();
    });
    packageGrid.appendChild(el);
  });
}

// voucher shelf
const voucherShelf = $('voucherShelf');
function renderVoucherShelf(){
  voucherShelf.innerHTML='';
  VOUCHERS.forEach(v=>{
    const el = document.createElement('div'); el.className='voucher-card';
    el.innerHTML = `<div><b>${v.code}</b><div style="font-size:12px">${v.desc}</div></div><button class="btn-outline">Pakai</button>`;
    el.querySelector('button').addEventListener('click', ()=>{
      $('voucherInput').value = v.code; state.voucher = v.code; updateSummary();
    });
    voucherShelf.appendChild(el);
  });
}
renderVoucherShelf();
$('applyVoucher').addEventListener('click', ()=>{ state.voucher = $('voucherInput').value.trim().toUpperCase(); updateSummary(); });

// render payments
const paymentGrid = $('paymentGrid');
function renderPayments(){
  paymentGrid.innerHTML='';
  PAYMENTS.forEach(p=>{
    const el = document.createElement('div'); el.className='payment-option';
    el.innerHTML = `<img src="${p.img}" width="56"><div>${p.name}</div>`;
    el.addEventListener('click', ()=>{ document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected')); el.classList.add('selected'); state.payment = p.id; updateSummary(); });
    paymentGrid.appendChild(el);
  });
}
renderPayments();

// price calc & summary
function getBase(){
  if(!state.game||!state.pack) return 0;
  return PRICES[state.game][state.pack]||0;
}
function getTotal(){
  let total = getBase();
  const code = (state.voucher||'').toUpperCase();
  const v = VOUCHERS.find(x=>x.code===code);
  if(v) total = Math.round(total * (1 - (v.disc||v.discount||0) || 0));
  return total;
}
function updateSummary(){
  $('sumGame').textContent = state.game? GAMES.find(g=>g.id===state.game).name : '-';
  $('sumId').textContent = $('idgame').value.trim() || '-';
  $('sumPack').textContent = state.pack || '-';
  $('sumVoucher').textContent = state.voucher || '-';
  $('sumPrice').textContent = 'Rp' + getTotal().toLocaleString();
}

// checkout
$('checkoutA').addEventListener('click', ()=>{
  if(!state.game || !state.pack || !state.payment || !$('idgame').value.trim()){
    alert('Lengkapi pilihan: Game, ID, Paket, Metode Pembayaran.');
    return;
  }
  const idv = $('idgame').value.trim();
  const sid = $('serverid').value.trim();
  const finalId = (state.game==='ml' && sid)? `${idv} (S:${sid})` : idv;
  const msg = `Halo Admin, saya ingin top up:\nGame: ${GAMES.find(g=>g.id===state.game).name}\nID: ${finalId}\nPaket: ${state.pack}\nPayment: ${state.payment}\nVoucher: ${state.voucher||'-'}\nTotal: Rp ${getTotal().toLocaleString()}`;
  window.open(`https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`, '_blank');
});

// next button
$('toPackage').addEventListener('click', ()=>{ if(!$('idgame').value.trim()){ alert('Masukkan ID/UID terlebih dahulu'); return; } $('step-package').classList.remove('hidden'); setTimeout(()=>window.scrollTo({top: $('step-package').offsetTop-20, behavior:'smooth'}),100); });

// init
renderGames();
updateSummary();
