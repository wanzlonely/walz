// Final script.js - clean version
const ADMIN_WA = "6282298902274";

/* ===== DATA: price catalog per game ===== */
const priceCatalog = {
  freefire: [
    {amt: 12, base: 2500}, {amt: 50, base: 9000}, {amt: 86, base: 15000},
    {amt: 170, base: 30000}, {amt: 257, base: 45000}, {amt: 514, base: 90000}, {amt: 1000, base: 165000}
  ],
  mlbb: [
    {amt: 12, base: 2200}, {amt: 50, base: 8500}, {amt: 86, base: 14000},
    {amt: 170, base: 28000}, {amt: 257, base: 42000}, {amt: 514, base: 88000}, {amt: 1000, base: 160000}
  ],
  hok: [
    {amt: 12, base: 2300}, {amt: 50, base: 8700}, {amt: 86, base: 14500},
    {amt: 170, base: 29000}, {amt: 257, base: 43500}, {amt: 514, base: 91000}, {amt: 1000, base: 162000}
  ],
  genshin: [
    {amt: 10, base: 14000}, {amt: 33, base: 42000}, {amt: 66, base: 82000},
    {amt: 88, base: 105000}, {amt: 155, base: 180000}
  ],
  roblox: [
    {amt: 40, base: 8500}, {amt: 80, base: 16000}, {amt: 240, base: 47000}, {amt: 800, base: 150000}
  ],
  stumble: [
    {amt: 50, base: 9000}, {amt: 120, base: 21000}, {amt: 300, base: 48000}
  ]
};

/* fee rates per method */
const feeRate = { qris: 0.007, shopeepay: 0.012, dana: 0.012, gopay: 0.012, ovo: 0.012 };

/* payment methods meta */
const paymentsMeta = [
  {id: "qris", name: "QRIS", img: "https://files.catbox.moe/crlcvj.jpg"},
  {id: "shopeepay", name: "ShopeePay", img: "https://files.catbox.moe/gub7ik.jpg"},
  {id: "dana", name: "DANA", img: "https://files.catbox.moe/f5ey4y.jpg"},
  {id: "gopay", name: "GoPay", img: "https://files.catbox.moe/je0irt.jpg"},
  {id: "ovo", name: "OVO", img: "https://files.catbox.moe/57f44a.jpg"}
];

/* voucher map */
const vouchers = {
  PROMOHEMAT: { rate: 0.05, max: 5000 },
  TOPUPMURAH: { rate: 0.08, max: 10000 }
};

/* helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const fmt = n => "Rp " + Math.round(n).toLocaleString("id-ID");

/* read params */
const params = Object.fromEntries(new URLSearchParams(location.search).entries());
const gameKey = params.key || "freefire";
const gameNameParam = params.name ? decodeURIComponent(params.name) : "";
const gameImgParam = params.img || "";
const needServer = params.server === "true" || params.server === "1";

/* UI elements */
const bannerEl = $("#gameBanner");
const gameNameEl = $("#selectedGameName");
const gameStudioEl = $("#selectedGameStudio");
const serverField = $("#serverField");
const diamondGrid = $("#diamondGrid");
const paymentGrid = $("#paymentGrid");
const checkoutBtn = $("#checkoutBtn");
const modal = $("#modal");
const closeModal = $("#closeModal");
const btnConfirm = $("#btnConfirm");
const btnEdit = $("#btnEdit");

/* state */
let state = {
  gameKey,
  gameName: gameNameParam || capitalizeKey(gameKey),
  gameImg: gameImgParam,
  needServer,
  selectedPack: null,
  priceMap: {},
  selectedMethod: null,
  voucher: null
};

/* init */
function init() {
  bannerEl.src = state.gameImg || "https://files.catbox.moe/x5rvpg.jpg";
  gameNameEl.textContent = state.gameName;
  gameStudioEl.textContent = "";

  serverField.style.display = state.needServer ? "block" : "none";

  renderDiamonds();
  renderPayments();
  attachInteractions();
  validateForm();
}

/* capitalize key fallback */
function capitalizeKey(k){
  return k.replace(/[-_]/g,' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* apply small promo discount */
function promoPrice(base){ return Math.round(base * 0.95); }

/* compute price map with fee */
function computePriceMap(base){
  const out = {};
  Object.keys(feeRate).forEach(k => {
    const fee = Math.ceil(base * feeRate[k] / 100) * 100; // round to 100
    out[k] = base + fee;
  });
  return out;
}

/* render diamond packs */
function renderDiamonds(){
  diamondGrid.innerHTML = "";
  const list = priceCatalog[state.gameKey] || priceCatalog["freefire"];
  list.forEach(pack => {
    const discounted = promoPrice(pack.base);
    const el = document.createElement("button");
    el.className = "diamond-card";
    el.type = "button";
    el.dataset.amt = pack.amt;
    el.dataset.base = pack.base;
    el.innerHTML = `
      <div class="d-left">
        <div class="d-ico">💎</div>
        <div class="d-info">
          <div class="d-amt">${pack.amt} ${state.gameKey === 'genshin' ? 'Primogems' : 'Diamonds'}</div>
          <div class="d-price">${fmt(discounted)}</div>
        </div>
      </div>
      <div class="d-action muted">Pilih</div>
    `;
    diamondGrid.appendChild(el);
  });
}

/* render payment methods */
function renderPayments(){
  paymentGrid.innerHTML = "";
  paymentsMeta.forEach(pm => {
    const btn = document.createElement("button");
    btn.className = "payment-card";
    btn.type = "button";
    btn.dataset.method = pm.id;
    btn.innerHTML = `
      <img src="${pm.img}" alt="${pm.name}">
      <div class="pay-meta">
        <div class="name">${pm.name}</div>
        <div class="price muted" data-price="${pm.id}">-</div>
      </div>
    `;
    paymentGrid.appendChild(btn);
  });
}

/* attach interactions */
function attachInteractions(){
  $$(".diamond-card").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".diamond-card").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");

      const amt = +btn.dataset.amt;
      const base = +btn.dataset.base;
      state.selectedPack = {amt, base};

      const promoBase = promoPrice(base);
      state.priceMap = computePriceMap(promoBase);

      updatePaymentPrices();
      validateForm();
    });
  });

  $$(".payment-card").forEach(card => {
    card.addEventListener("click", () => {
      if (!state.selectedPack) {
        card.animate([{transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:220});
        return;
      }
      $$(".payment-card").forEach(x => x.classList.remove("active"));
      card.classList.add("active");
      state.selectedMethod = card.dataset.method;
      validateForm();
    });
  });

  $("#userId").addEventListener("input", () => {
    $("#errUserId").textContent = "";
    $("#userId").classList.remove("input-error");
    validateForm();
  });
  $("#serverId")?.addEventListener("input", () => {
    $("#errServerId").textContent = "";
    $("#serverId").classList.remove("input-error");
    validateForm();
  });

  checkoutBtn.addEventListener("click", onCheckout);
  closeModal.addEventListener("click", closeModalFn);
  btnEdit.addEventListener("click", closeModalFn);
  btnConfirm.addEventListener("click", onConfirm);
}

/* update payment prices */
function updatePaymentPrices(){
  $$("#paymentGrid .payment-card").forEach(card => {
    const method = card.dataset.method;
    const priceEl = card.querySelector(`[data-price="${method}"]`);
    priceEl.textContent = state.priceMap[method] ? fmt(state.priceMap[method]) : "-";
  });
}

/* validate form */
function validateForm(){
  const uid = $("#userId").value.trim();
  const srv = $("#serverId") ? $("#serverId").value.trim() : "";
  const ok = uid && (!state.needServer || srv) && state.selectedPack && state.selectedMethod;
  checkoutBtn.disabled = !ok;
}

/* checkout */
function onCheckout(){
  const uid = $("#userId").value.trim();
  const srv = $("#serverId") ? $("#serverId").value.trim() : "";
  const voucherCode = $("#voucher").value.trim().toUpperCase();

  if (!uid) return showFieldError("#userId","#errUserId","Kolom ID Game belum diisi");
  if (state.needServer && !srv) return showFieldError("#serverId","#errServerId","Kolom Server ID belum diisi");
  if (!state.selectedPack) return alert("Silakan pilih paket diamond terlebih dahulu");
  if (!state.selectedMethod) return alert("Silakan pilih metode pembayaran");

  const basePromo = promoPrice(state.selectedPack.base);
  const payPrice = state.priceMap[state.selectedMethod] || basePromo;
  const { total, info } = applyVoucher(payPrice, voucherCode);

  $("#sumGame").textContent = state.gameName;
  $("#sumId").textContent = uid;
  if (state.needServer) { $("#sumServerRow").style.display = "flex"; $("#sumServer").textContent = srv; }
  else $("#sumServerRow").style.display = "none";

  $("#sumPack").textContent = `${state.selectedPack.amt} ${state.gameKey==='genshin'?'Primogems':'Diamonds'}`;
  $("#sumMethod").textContent = state.selectedMethod.toUpperCase();
  $("#sumPrice").textContent = fmt(payPrice);

  if (info && info.discount>0) { $("#sumVoucherRow").style.display = "flex"; $("#sumVoucher").textContent = `${info.code} (−${fmt(info.discount)})`; }
  else $("#sumVoucherRow").style.display = "none";

  $("#sumTotal").textContent = fmt(total);

  state.finalTotal = total;
  state.finalBase = payPrice;
  state.voucherApplied = info;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}

/* field error */
function showFieldError(inputSel, errSel, message){
  const input = $(inputSel);
  const err = $(errSel);
  err.textContent = message;
  input.classList.add("input-error");
  input.focus();
}

/* apply voucher */
function applyVoucher(total, code){
  if (!code) return { total, info: null };
  const v = vouchers[code];
  if (!v) return { total, info: { code, discount: 0 } };
  const disc = Math.min(Math.round(total * v.rate), v.max);
  return { total: Math.max(total - disc, 0), info: { code, discount: disc } };
}

/* close modal */
function closeModalFn(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}

/* confirm -> open WA */
function onConfirm(){
  const uid = $("#userId").value.trim();
  const srv = $("#serverId") ? $("#serverId").value.trim() : "";
  const voucherCode = $("#voucher").value.trim().toUpperCase();

  const lines = [
    "Halo Admin, saya ingin Top Up:",
    `Game: ${state.gameName}`,
    `ID: ${uid}`,
  ];
  if (state.needServer) lines.push(`Server: ${srv || "-"}`);
  lines.push(`Paket: ${state.selectedPack.amt} ${state.gameKey==='genshin'?'Primogems':'Diamonds'}`);
  lines.push(`Metode: ${state.selectedMethod.toUpperCase()}`);
  lines.push(`Harga: ${fmt(state.finalBase)}`);
  if (state.voucherApplied && state.voucherApplied.discount>0) lines.push(`Voucher: ${state.voucherApplied.code} (disc ${fmt(state.voucherApplied.discount)})`);
  else if (voucherCode) lines.push(`Voucher: ${voucherCode} (tidak berlaku)`);
  lines.push(`Total Bayar: ${fmt(state.finalTotal)}`);

  const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(waUrl, "_blank");
}

/* init */
init();