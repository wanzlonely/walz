// --- DATA HARGA DIAMOND ---
const hargaDiamond = {
  "5": 1500,
  "12": 3500,
  "50": 12000,
  "100": 23000,
  "250": 57000,
  "500": 110000,
  "1000": 215000
};

// --- SELEKSI DIAMOND ---
const diamondOptions = document.querySelectorAll(".diamond-option");
let selectedDiamond = null;
let selectedPayment = null;

diamondOptions.forEach(option => {
  option.addEventListener("click", () => {
    diamondOptions.forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");
    selectedDiamond = option.dataset.value;
    updatePrice();
  });
});

// --- SELEKSI METODE PEMBAYARAN ---
const paymentOptions = document.querySelectorAll(".payment-option");
paymentOptions.forEach(option => {
  option.addEventListener("click", () => {
    paymentOptions.forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");
    selectedPayment = option.dataset.method;
  });
});

// --- UPDATE HARGA ---
function updatePrice() {
  const priceEl = document.getElementById("priceDisplay");
  if (selectedDiamond && hargaDiamond[selectedDiamond]) {
    const harga = hargaDiamond[selectedDiamond];
    priceEl.textContent = `Rp ${harga.toLocaleString("id-ID")}`;
  } else {
    priceEl.textContent = "Rp 0";
  }
}

// --- VALIDASI & CHECKOUT ---
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  const userId = document.getElementById("userId")?.value.trim();
  const serverId = document.getElementById("serverId")?.value.trim();
  const voucher = document.getElementById("voucherCode")?.value.trim();

  if (!userId) return alert("Kolom ID Game belum diisi!");
  if (document.getElementById("serverId") && !serverId) return alert("Kolom Server ID belum diisi!");
  if (!selectedDiamond) return alert("Silakan pilih jumlah Diamond!");
  if (!selectedPayment) return alert("Silakan pilih metode pembayaran!");

  // Data transaksi
  const harga = hargaDiamond[selectedDiamond];
  const detail = {
    "Game ID": userId + (serverId ? " (" + serverId + ")" : ""),
    "Diamond": selectedDiamond,
    "Harga": `Rp ${harga.toLocaleString("id-ID")}`,
    "Metode Pembayaran": selectedPayment,
    "Voucher": voucher ? voucher : "Tidak ada"
  };

  // Isi ke popup
  const listEl = document.getElementById("popupDetails");
  listEl.innerHTML = "";
  for (const key in detail) {
    const li = document.createElement("li");
    li.textContent = `${key}: ${detail[key]}`;
    listEl.appendChild(li);
  }

  // Tampilkan popup
  document.getElementById("popup").style.display = "flex";
});

// --- CLOSE POPUP ---
document.getElementById("closePopup")?.addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
});

// --- CHECKOUT VIA WHATSAPP ---
document.getElementById("waCheckout")?.addEventListener("click", () => {
  const details = [...document.querySelectorAll("#popupDetails li")]
    .map(li => li.textContent)
    .join("%0A");

  const nomor = "6282298902274"; // Nomor WhatsApp
  const url = `https://wa.me/${nomor}?text=Halo%20Admin,%20saya%20ingin%20order:%0A${details}`;
  window.open(url, "_blank");
});