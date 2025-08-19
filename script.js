let selectedGame = null;
let selectedNominal = null;
let selectedPayment = null;

// Nominal pilihan
const nominalOptions = [
  { jumlah: "5 Diamonds", harga: 1000 },
  { jumlah: "20 Diamonds", harga: 4000 },
  { jumlah: "50 Diamonds", harga: 10000 },
  { jumlah: "100 Diamonds", harga: 18000 },
  { jumlah: "250 Diamonds", harga: 45000 },
  { jumlah: "500 Diamonds", harga: 85000 },
];

const nominalContainer = document.getElementById("nominalOptions");

// Render nominal
nominalOptions.forEach((item) => {
  const div = document.createElement("div");
  div.classList.add("nominal-option");
  div.textContent = `${item.jumlah}\nRp ${item.harga.toLocaleString()}`;
  div.addEventListener("click", () => {
    document.querySelectorAll(".nominal-option").forEach(el => el.classList.remove("active"));
    div.classList.add("active");
    selectedNominal = item;
  });
  nominalContainer.appendChild(div);
});

// Pilih Game
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".game-card").forEach(el => el.classList.remove("active"));
    card.classList.add("active");
    selectedGame = card.dataset.game;
  });
});

// Pilih pembayaran
document.querySelectorAll(".pay-option").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pay-option").forEach(el => el.classList.remove("selected"));
    btn.classList.add("selected");
    selectedPayment = btn.dataset.method;
  });
});

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const playerId = document.getElementById("playerId").value;
  const serverId = document.getElementById("serverId").value;
  const note = document.getElementById("note").value;
  const voucher = document.getElementById("voucher").value;

  if (!selectedGame || !playerId || !selectedNominal || !selectedPayment) {
    alert("Lengkapi semua data terlebih dahulu!");
    return;
  }

  let harga = selectedNominal.harga;

  // Voucher
  if (voucher.toUpperCase() === "PROMOHEMAT") {
    let potongan = Math.min(harga * 0.1, 6000);
    harga -= potongan;
  }

  const message = 
`Halo Admin, saya ingin Top Up:
Game: ${selectedGame}
ID: ${playerId}${serverId ? " ("+serverId+")" : ""}
Nominal: ${selectedNominal.jumlah}
Metode: ${selectedPayment}
Catatan: ${note || "-"}
Total: Rp ${harga.toLocaleString()}`;

  const waUrl = `https://wa.me/6282298902274?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
});