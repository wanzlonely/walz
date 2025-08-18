// Premium version (no API). Checkout -> WA 6282298902274
const GAMES = [
  {id:'ff',name:'Free Fire',bg:'https://files.catbox.moe/oqnxag.jpeg',theme:'fire'},
  {id:'ml',name:'Mobile Legends',bg:'https://files.catbox.moe/h7whee.jpeg',theme:'neon'},
  {id:'hok',name:'Honor of Kings',bg:'https://files.catbox.moe/04zakl.jpeg',theme:'gold'},
  {id:'roblox',name:'Roblox',bg:'https://files.catbox.moe/ldegjz.png',theme:'pixel'}
];

const PRICES = {
  ff: {"70 Diamonds":9000,"140 Diamonds":18000,"355 Diamonds":45000,"720 Diamonds":90000,"1450 Diamonds":180000},
  ml: {"86 Diamonds":23000,"172 Diamonds":45000,"514 Diamonds":120000,"706 Diamonds":160000,"1000 Diamonds":220000},
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
  {code:'PROMO10',desc:'Diskon 10%',disc:0.10,exp:'2025-12-31',min:0,only:null},
  {code:'ML15',desc:'ML khusus 15%',disc:0.15,exp:'2026-01-01',min:20000,only:'ml'}
];

let state = {game:null,pack:null,payment:null,voucher:'',spinDiscount: Number(localStorage.getItem('spinDiscount')||0)};

// helpers
const $ = id=>document.getElementById(id);
const money = n=>'Rp '+(n||0).toLocaleString('id-ID');

// render games
const gameGridB = $('gameGridB');
function renderGames(){
  gameGridB.innerHTML='';
  GAMES.forEach(g=>{
    const el = document.createElement('div'); el.className='gameCardB'; el.style.backgroundImage=`url(${g.bg})`;
    el.innerHTML = `<div>${g.name}</div>`;
    el.addEventListener('click', ()=>{ document.querySelectorAll('.gameCardB').forEach(x=>x.classList.remove('selected')); el.classList.add('selected'); state.game=g.id; $('idArea').classList.remove('hidden'); if(g.id==='ml') $('serverB').classList.remove('hidden'); else $('serverB').classList.add('hidden'); renderPackages(g.id); updateSummary(); });
    gameGridB.appendChild(el);
  });
}
renderGames();

// search
$('searchB').addEventListener('input', e=>{ const q=e.target.value.toLowerCase().trim(); document.querySelectorAll('.gameCardB').forEach(card=>{ const t=card.textContent.toLowerCase(); card.style.display = t.includes(q)?'block':'none'; }); });

// packages
function renderPackages(gameId){
  const grid = $('packageGridB'); grid.innerHTML='';
  const packs = PRICES[gameId]||{};
  Object.keys(packs).forEach((k,i)=>{ const el=document.createElement('div'); el.className='packageCardB'; const badge = i===0?'<div class="badgeB">Best</div>':''; el.innerHTML = badge+`<div class="pkg-top"><img src="https://cdn-icons-png.flaticon.com/512/2907/2907253.png" width="28"><div><div class="pkg-name">${k}</div><div class="pkg-price">${money(packs[k])}</div></div></div>`; el.addEventListener('click', ()=>{ document.querySelectorAll('.packageCardB').forEach(x=>x.classList.remove('selected')); el.classList.add('selected'); state.pack=k; $('voucherArea').classList.remove('hidden'); $('paymentArea').classList.remove('hidden'); $('summaryB').classList.remove('hidden'); updateSummary(); }); grid.appendChild(el); });
}

// filters (simple)
document.querySelectorAll('.filtersB .chip, .filtersB .chip').forEach(btn=>btn?.addEventListener('click', (e)=>{ document.querySelectorAll('.filtersB .chip').forEach(x=>x.classList.remove('active')); e.target.classList.add('active'); }));

// voucher strip
const voucherStripB = $('voucherStripB');
function renderVoucherStrip(){ voucherStripB.innerHTML=''; VOUCHERS.forEach(v=>{ const el=document.createElement('div'); el.className='voucherCardB'; el.innerHTML = `<div><b>${v.code}</b><div style="font-size:13px">${v.desc}</div></div><button class="btn-outlineB">Pakai</button>`; el.querySelector('button').addEventListener('click', ()=>{ $('voucherB').value=v.code; state.voucher=v.code; updateSummary(); }); voucherStripB.appendChild(el); }); }
renderVoucherStrip();
$('applyVoucherB').addEventListener('click', ()=>{ state.voucher = $('voucherB').value.trim().toUpperCase(); updateSummary(); });

// payments
const paymentGridB = $('paymentGridB');
function renderPaymentsB(){ paymentGridB.innerHTML=''; PAYMENTS.forEach(p=>{ const el=document.createElement('div'); el.className='paymentOptionB'; el.innerHTML = `<img src="${p.img}" width="56"><div>${p.name}</div>`; el.addEventListener('click', ()=>{ document.querySelectorAll('.paymentOptionB').forEach(x=>x.classList.remove('selected')); el.classList.add('selected'); state.payment = p.id; updateSummary(); }); paymentGridB.appendChild(el); }); }
renderPaymentsB();

// price calc
function basePrice(){ if(!state.game||!state.pack) return 0; return PRICES[state.game][state.pack]||0; }
function voucherDiscount(b){ const code = (state.voucher||'').toUpperCase(); if(!code) return 0; const v = VOUCHERS.find(x=>x.code===code); if(!v) return 0; if(v.only && v.only!==state.game) return 0; if(b < v.min) return 0; return v.disc||0; }
function totalPrice(){ let b = basePrice(); const vd = voucherDiscount(b); b = Math.round(b * (1 - vd)); const spin = state.spinDiscount||0; if(spin) b = Math.round(b * (1 - spin)); return b; }

function updateSummary(){
  $('gB').textContent = state.game? GAMES.find(x=>x.id===state.game).name : '-';
  $('idvB').textContent = $('idB').value.trim() || '-';
  $('pB').textContent = state.pack || '-';
  $('vB').textContent = state.voucher || '-';
  $('tB').textContent = money(totalPrice());
}

// proceed & confirm
$('payNowB').addEventListener('click', ()=>{
  if(!state.game||!state.pack||!state.payment||!$('idB').value.trim()){ alert('Lengkapi pilihan & ID'); return; }
  const gid = GAMES.find(g=>g.id===state.game).name;
  const uid = $('idB').value.trim(); const sid = $('serverB').value.trim(); const fid = (state.game==='ml' && sid) ? `${uid} (S:${sid})` : uid;
  const pm = PAYMENTS.find(p=>p.id===state.payment).name;
  const total = totalPrice();
  const msg = `Halo Admin, saya ingin top up:\nGame: ${gid}\nID: ${fid}\nPaket: ${state.pack}\nPayment: ${pm}\nVoucher: ${state.voucher||'-'}\nTotal: Rp ${total.toLocaleString()}`;
  // direct to whatsapp
  window.open(`https://wa.me/6282298902274?text=${encodeURIComponent(msg)}`,'_blank');
});

// small hero canvas animation (subtle)
const heroCanvas = $('heroCanvas'); const hc = heroCanvas.getContext('2d');
function resizeHero(){ heroCanvas.width = heroCanvas.clientWidth; heroCanvas.height = heroCanvas.clientHeight; } window.addEventListener('resize', resizeHero); resizeHero();
let time=0; function drawHero(){ hc.clearRect(0,0,heroCanvas.width,heroCanvas.height); for(let i=0;i<40;i++){ const x = (i*32 + time*0.3) % heroCanvas.width; const y = heroCanvas.height/2 + Math.sin((i*0.5) + time*0.02)*30; hc.fillStyle = `rgba(58,161,255,0.06)`; hc.beginPath(); hc.arc(x,y,6,0,Math.PI*2); hc.fill(); } time++; requestAnimationFrame(drawHero); } drawHero();

// theme toggle
$('darkToggle').addEventListener('click', ()=>{ document.body.classList.toggle('theme-dark'); });

// init small
function initB(){ renderGames(); renderPaymentsB(); renderVoucherStrip(); updateSummary(); const first = document.querySelector('.gameCardB'); if(first) first.click(); }
initB();
