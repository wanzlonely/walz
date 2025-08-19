/* script.js - multi page logic for game.html + index helpers */
const ADMIN_WA = "6282298902274";

/* --- data --- */
const gameCatalog = {
  freefire: { name: "Free Fire", img: "https://files.catbox.moe/x5rvpg.jpg", studio: "Garena", server: false },
  mobilelegends: { name: "Mobile Legends", img: "https://files.catbox.moe/wcxi20.jpg", studio: "Moonton", server: true },
  honorofkings: { name: "Honor of Kings", img: "https://files.catbox.moe/rh78kj.jpg", studio: "Tencent", server: false },
  genshin: { name: "Genshin Impact", img: "https://files.catbox.moe/b91rfb.jpg", studio: "HoYoverse", server: true },
  roblox: { name: "Roblox", img: "https://files.catbox.moe/uvixa8.jpg", studio: "Roblox Corp", server: false },
  stumble: { name: "Stumble Guys", img: "https://files.catbox.moe/712fja.jpg", studio: "Kitka", server: false },
};

/* full diamond catalog (more complete) */
const diamondCatalog = [
  { amt: 5, base: 1000 },{ amt: 12, base: 2500 },{ amt: 28, base: 5500 },
  { amt: 44, base: 8500 },{ amt: 59, base: 11000 },{ amt: 86, base: 15000 },
  { amt: 170, base: 30000 },{ amt: 257, base: 45000 },{ amt: 344, base: 60000 },
  { amt: 514, base: 90000 },{ amt: 706, base: 120000 },{ amt: 1000, base: 165000 },
];

/* payment fee rates (used to calc final price per method) */
const feeRate = { qris: 0.007, shopeepay: 0.012, dana: 0.012, gopay: 0.012, ovo: 0.012 };

/* vouchers */
const vouchers = { PROMOHEMAT: { rate: 0.10, max: 6000 }, TOPUPMURAH: { rate: 0.05, max: 4000 } };

/* payment meta */
const paymentMethods = [
  { id: "qris", name: "QRIS", img: "https://files.catbox.moe/crlcvj.jpg" },
  { id: "shopeepay", name: "ShopeePay", img: "https://files.catbox.moe/gub7ik.jpg" },
  { id: "dana", name: "DANA", img: "https://files.catbox.moe/f5ey4y.jpg" },
  { id: "gopay", name: "GoPay", img: "https://files.catbox.moe/je0irt.jpg" },
  { id: "ovo", name: "OVO", img: "https://files.catbox.moe/57f44a.jpg" },
];

/* helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const fmt = n => "Rp " + n.toLocaleString("id-ID");

/* get URL params */
function params() {
  return Object.fromEntries(new URLSearchParams(location.search).entries());
}

/* compute price map for base price: adds fee and rounds to nearest 100 */
function computePriceMap(base) {
  const out = {};
  Object.keys(feeRate).forEach(k => {
    const fee = Math.ceil((base * feeRate[k]) / 100) * 100;
    out[k] = base + fee;
  });
  return out;
}

/* apply voucher */
function applyVoucher(total, code) {
  if (!code) return { total, info: null };
  const v = vouchers[code.trim().toUpperCase()];
  if (!v) return { total, info: { code: code.toUpperCase(), discount: 0 } };
  const disc = Math.min(Math.round(total * v.rate), v.max);
  return { total: Math.max(total - disc, 0), info: { code: code.toUpperCase(), discount: disc } };
}

/* --- page logic (only runs on game.html) --- */
if (document.getElementById("gameName")) {
  const p = params();
  const key = p.key || "freefire";
  const game = gameCatalog[key] || gameCatalog.freefire;

  // set header block
  $("#gameBanner").src = game.img;
  $("#gameName").textContent = game.name;
  $("#gameStudio").textContent = game.studio || "";
  if (game.server) $("#serverField").style.display = "block";

  // render diamonds
  const diamondGrid = $("#diamondGrid");
  diamondCatalog.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "diamond-card";
    btn.innerHTML = `
      <div class="d-left">
        <div class="d-ico">💎</div>
        <div>
          <div class="d-amt">${item.amt} Diamonds</div>
          <div class="d-price">${fmt(item.base)}</div>
        </div>
      </div>
      <div class="d-action muted">Pilih</div>
    `;
    btn.addEventListener("click", () => {
      $$(".diamond-card").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.diamond = item;
      state.priceMap = computePriceMap(item.base);
      updatePaymentPrices();
      validate();
    });
    diamondGrid.appendChild(btn);
  });

  // render payment methods
  const paymentGrid = $("#paymentGrid");
  paymentMethods.forEach(m => {
    const btn = document.createElement("button");
    btn.className = "payment-card";
    btn.dataset.method = m.id;
    btn.innerHTML = `
      <img src="${m.img}" alt="${m.name}">
      <div class="pay-meta">
        <div class="name">${m.name}</div>
        <div class="price muted" data-price="${m.id}">-</div>
      </div>
    `;
    btn.addEventListener("click", () => {
      if (!state.diamond) {
        btn.animate([{transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:200});
        return;
      }
      $$(".payment-card").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.method = m.id;
      validate();
    });
    paymentGrid.appendChild(btn);
  });

  // state
  const state = { diamond: null, priceMap: {}, method: null };
  const inputId = $("#inputId"), inputServer = $("#inputServer"), voucher = $("#voucher");

  function updatePaymentPrices() {
    $$("#paymentGrid [data-price]").forEach(el => {
      const method = el.getAttribute("data-price");
      el.textContent = state.priceMap[method] ? fmt(state.priceMap[method]) : "-";
    });
  }

  // validation
  function validate() {
    const ok = inputId.value.trim() && state.diamond && state.method;
    $("#btnCheckout").disabled = !ok;
  }
  inputId.addEventListener("input", validate);
  inputServer.addEventListener("input", validate);
  voucher.addEventListener("input", ()=>{ /* no-op: voucher only applied on modal */ });

  // checkout -> show modal
  $("#btnCheckout").addEventListener("click", () => {
    const id = inputId.value.trim();
    const srv = inputServer.value.trim();
    const method = state.method;
    const basePrice = state.priceMap[method] || state.diamond.base;
    const { total, info } = applyVoucher(basePrice, voucher.value);

    $("#sumGame").textContent = game.name;
    $("#sumId").textContent = id;
    if (game.server) { $("#sumServerRow").style.display = "flex"; $("#sumServer").textContent = srv || "-"; } else { $("#sumServerRow").style.display = "none"; }
    $("#sumPack").textContent = `${state.diamond.amt} Diamonds`;
    $("#sumMethod").textContent = method.toUpperCase();
    $("#sumPrice").textContent = fmt(basePrice);

    if (info && info.discount > 0) {
      $("#sumVoucherRow").style.display = "flex";
      $("#sumVoucher").textContent = `${info.code} (−${fmt(info.discount)})`;
    } else if (voucher.value.trim()) {
      $("#sumVoucherRow").style.display = "flex";
      $("#sumVoucher").textContent = `${voucher.value.trim().toUpperCase()} (tidak berlaku)`;
    } else {
      $("#sumVoucherRow").style.display = "none";
    }
    $("#sumTotal").textContent = fmt(total);

    $("#modal").classList.add("show");
  });

  // modal actions
  $("#closeModal").addEventListener("click", ()=> $("#modal").classList.remove("show"));
  $("#btnEdit").addEventListener("click", ()=> $("#modal").classList.remove("show"));

  $("#btnConfirm").addEventListener("click", () => {
    const id = inputId.value.trim();
    const srv = inputServer.value.trim();
    const method = state.method;
    const basePrice = state.priceMap[method] || state.diamond.base;
    const { total, info } = applyVoucher(basePrice, voucher.value);

    const lines = [
      "Halo Admin, saya ingin Top Up:",
      `Game: ${game.name}`,
      `ID: ${id}`,
    ];
    if (game.server) lines.push(`Server: ${srv || "-"}`);
    lines.push(`Paket: ${state.diamond.amt} Diamonds`, `Metode: ${method.toUpperCase()}`, `Harga: ${fmt(basePrice)}`);
    if (info && info.discount > 0) lines.push(`Voucher: ${info.code} (disc ${fmt(info.discount)})`);
    else if (voucher.value.trim()) lines.push(`Voucher: ${voucher.value.trim().toUpperCase()} (tidak berlaku)`);
    lines.push(`Total Bayar: ${fmt(total)}`);

    const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(waUrl, "_blank");
  });
}