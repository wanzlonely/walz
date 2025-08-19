// ====== DATA ======
const gamesWithServer = ["Mobile Legends", "Honor of Kings", "Genshin Impact"];

// Paket diamond (lebih lengkap)
const diamondCatalog = [
  { amt: 5,    base: 1000 },
  { amt: 12,   base: 2500 },
  { amt: 28,   base: 5500 },
  { amt: 44,   base: 8500 },
  { amt: 59,   base: 11000 },
  { amt: 86,   base: 15000 },
  { amt: 170,  base: 30000 },
  { amt: 257,  base: 45000 },
  { amt: 344,  base: 60000 },
  { amt: 514,  base: 90000 },
  { amt: 706,  base: 120000 },
  { amt: 1000, base: 165000 },
];

// Biaya admin (persentase) per metode
const feeRate = {
  qris: 0.007,
  shopeepay: 0.012,
  dana: 0.012,
  gopay: 0.012,
  ovo: 0.012,
};

// Voucher: kode -> {rate, max}
const vouchers = {
  "PROMOHEMAT": { rate: 0.10, max: 6000 },
  "TOPUPMURAH": { rate: 0.05, max: 4000 },
};

// ====== ELEMENTS ======
const stepGames   = document.getElementById("step-games");
const stepDetails = document.getElementById("step-details");
const backToGames = document.getElementById("backToGames");
const selectedGameLabel = document.getElementById("selectedGameLabel");
const detailsTitle = document.getElementById("detailsTitle");

const userId = document.getElementById("userId");
const serverWrap = document.getElementById("serverWrap");
const serverId = document.getElementById("serverId");

const diamondGrid = document.getElementById("diamondGrid");
const paymentGrid = document.getElementById("paymentGrid");
const voucherInput = document.getElementById("voucher");
const checkoutBtn = document.getElementById("checkoutBtn");

// Modal
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const editOrder = document.getElementById("editOrder");
const confirmOrder = document.getElementById("confirmOrder");

const sumGame = document.getElementById("sumGame");
const sumUser = document.getElementById("sumUser");
const sumServerRow = document.getElementById("sumServerRow");
const sumServer = document.getElementById("sumServer");
const sumDiamond = document.getElementById("sumDiamond");
const sumMethod = document.getElementById("sumMethod");
const sumPrice = document.getElementById("sumPrice");
const sumVoucherRow = document.getElementById("sumVoucherRow");
const sumVoucher = document.getElementById("sumVoucher");
const sumTotal = document.getElementById("sumTotal");

// ====== STATE ======
let state = {
  gameName: null,
  gameKey: null,
  needServer: false,
  diamond: null,    // { amt, base }
  method: null,     // "qris" | "dana" | ...
  priceMap: {},     // computed price per method for selected diamond
};

// ====== HELPERS ======
const fmt = n => "Rp " + n.toLocaleString("id-ID");

function computePrices(base) {
  // Hitung harga final per metode = base + fee% dibulatkan ke 100 terdekat
  const out = {};
  Object.keys(feeRate).forEach(k => {
    const fee = Math.ceil((base * feeRate[k]) / 100) * 100; // pembulatan ke ratus
    const total = base + fee;
    out[k] = total;
  });
  return out;
}

function applyVoucher(total, code) {
  if (!code) return { total, info: null };
  const up = code.trim().toUpperCase();
  const v = vouchers[up];
  if (!v) return { total, info: { code: up, discount: 0 } };
  const cut = Math.min(Math.round(total * v.rate), v.max);
  return { total: Math.max(total - cut, 0), info: { code: up, discount: cut } };
}

function setActive(list, target) {
  list.forEach(el => el.classList.remove("active"));
  target.classList.add("active");
}

// ====== INIT: RENDER DIAMONDS ======
function renderDiamonds() {
  diamondGrid.innerHTML = "";
  diamondCatalog.forEach(item => {
    const card = document.createElement("button");
    card.className = "diamond-card";
    card.innerHTML = `
      <div class="left">
        <span class="icon">💎</span>
        <div>
          <div class="amount">${item.amt} Diamonds</div>
          <div class="price">${fmt(item.base)}</div>
        </div>
      </div>
      <div class="chev">Pilih</div>
    `;
    card.addEventListener("click", () => {
      setActive([...diamondGrid.querySelectorAll(".diamond-card")], card);
      state.diamond = { ...item };
      // Update harga di kartu pembayaran
      state.priceMap = computePrices(item.base);
      updatePaymentPrices();
      validateReady();
    });
    diamondGrid.appendChild(card);
  });
}
renderDiamonds();

// ====== PAYMENT PRICE UPDATE ======
function updatePaymentPrices() {
  paymentGrid.querySelectorAll(".payment-card").forEach(card => {
    const method = card.dataset.method;
    const priceEl = card.querySelector(`[data-price="${method}"]`);
    if (state.diamond && state.priceMap[method]) {
      priceEl.textContent = fmt(state.priceMap[method]);
    } else {
      priceEl.textContent = "-";
    }
  });
}

// ====== GAME SELECT (STEP 1) ======
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".game-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    state.gameName = card.dataset.game;
    state.gameKey = card.dataset.key;
    state.needServer = gamesWithServer.includes(state.gameName);

    // Go to details
    selectedGameLabel.textContent = state.gameName;
    detailsTitle.textContent = `${state.gameName} • Detail & Produk`;
    serverWrap.style.display = state.needServer ? "block" : "none";

    // Reset fields
    userId.value = "";
    serverId.value = "";
    state.diamond = null;
    state.method = null;
    setActive([...diamondGrid.querySelectorAll(".diamond-card")], {classList:{remove(){},add(){}}}); // noop
    paymentGrid.querySelectorAll(".payment-card").forEach(p => p.classList.remove("active"));
    updatePaymentPrices();
    validateReady();

    stepGames.classList.remove("show");
    setTimeout(()=>stepDetails.classList.add("show"), 60);
  });
});

backToGames.addEventListener("click", () => {
  stepDetails.classList.remove("show");
  setTimeout(()=>stepGames.classList.add("show"), 60);
});

// ====== PAYMENT SELECT ======
paymentGrid.querySelectorAll(".payment-card").forEach(card => {
  card.addEventListener("click", () => {
    if (!state.diamond) {
      // sedikit feedback
      card.animate([{transform:'translateY(0)'},{transform:'translateY(-2px)'},{transform:'translateY(0)'}],{duration:200});
      return;
    }
    setActive([...paymentGrid.querySelectorAll(".payment-card")], card);
    state.method = card.dataset.method;
    validateReady();
  });
});

// ====== VALIDATION ======
function validateReady() {
  const ok = state.gameName && userId.value.trim() && state.diamond && state.method;
  checkoutBtn.disabled = !ok;
}

// live validate when user types id
userId.addEventListener("input", validateReady);
serverId.addEventListener("input", validateReady);

// ====== CHECKOUT -> MODAL ======
checkoutBtn.addEventListener("click", () => {
  const uid = userId.value.trim();
  const sid = serverId.value.trim();
  if (!state.gameName || !uid || !state.diamond || !state.method) return;

  const baseTotal = state.priceMap[state.method] || state.diamond.base;
  const { total, info } = applyVoucher(baseTotal, voucherInput.value);

  // Fill summary
  sumGame.textContent = state.gameName;
  sumUser.textContent = uid;
  if (state.needServer) {
    sumServerRow.style.display = "flex";
    sumServer.textContent = sid || "-";
  } else {
    sumServerRow.style.display = "none";
  }
  sumDiamond.textContent = `${state.diamond.amt} Diamonds`;
  sumMethod.textContent = state.method.toUpperCase();
  sumPrice.textContent = fmt(baseTotal);

  if (info && info.discount > 0) {
    sumVoucherRow.style.display = "flex";
    sumVoucher.textContent = `${info.code} (−${fmt(info.discount)})`;
  } else if (voucherInput.value.trim()) {
    sumVoucherRow.style.display = "flex";
    sumVoucher.textContent = `${voucherInput.value.trim().toUpperCase()} (tidak berlaku)`;
  } else {
    sumVoucherRow.style.display = "none";
  }
  sumTotal.textContent = fmt(total);

  modal.classList.add("show");
});

// ====== MODAL ACTIONS ======
closeModal.addEventListener("click", ()=> modal.classList.remove("show"));
editOrder.addEventListener("click", ()=> modal.classList.remove("show"));

confirmOrder.addEventListener("click", () => {
  const uid = userId.value.trim();
  const sid = serverId.value.trim();
  const baseTotal = state.priceMap[state.method] || state.diamond.base;
  const { total, info } = applyVoucher(baseTotal, voucherInput.value);

  const lines = [
    "Halo Admin, saya ingin Top Up:",
    `Game: ${state.gameName}`,
    `ID: ${uid}`,
  ];
  if (state.needServer) lines.push(`Server ID: ${sid || "-"}`);
  lines.push(
    `Paket: ${state.diamond.amt} Diamonds`,
    `Metode: ${state.method.toUpperCase()}`,
    `Harga: ${fmt(baseTotal)}`
  );
  if (info && info.discount > 0) {
    lines.push(`Voucher: ${info.code} (disc ${fmt(info.discount)})`);
  } else if (voucherInput.value.trim()) {
    lines.push(`Voucher: ${voucherInput.value.trim().toUpperCase()} (tidak berlaku)`);
  }
  lines.push(`Total Bayar: ${fmt(total)}`);

  const message = lines.join("\n");
  const waUrl = `https://wa.me/6282298902274?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
});