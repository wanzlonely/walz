// --- Data Paket ---
const packages = [
  { name: "70 Diamonds", price: 9000 },
  { name: "140 Diamonds", price: 18000 },
  { name: "350 Diamonds", price: 45000 },
  { name: "720 Diamonds", price: 90000 },
  { name: "1450 Diamonds", price: 180000 },
  { name: "3000 Diamonds", price: 350000 }
];

// --- Variabel ---
let selectedPackage = null;

// --- Render Paket ---
const packageGrid = document.getElementById("packageGrid");
packages.forEach((pkg, index) => {
  const div = document.createElement("div");
  div.classList.add("package-item");
  div.innerHTML = `${pkg.name}<br><span>Rp ${pkg.price.toLocaleString()}</span>`;
  div.addEventListener("click", () => selectPackage(index));
  packageGrid.appendChild(div);
});

// --- Pilih Paket ---
function selectPackage(index) {
  const items = document.querySelectorAll(".package-item");
  items.forEach(item => item.classList.remove("active"));
  items[index].classList.add("active");
  selectedPackage = packages[index];
  updatePrice();
}

// --- Update Harga ---
function updatePrice() {
  let total = selectedPackage ? selectedPackage.price : 0;
  const inputVoucher = document.getElementById("voucher").value.trim().toUpperCase();

  if (inputVoucher === "WLZSPR") {
    total = total * 0.9; // diskon 10%
  }

  document.getElementById("stickyPrice").innerText =
    "Total: Rp " + total.toLocaleString();
}

// --- Event Voucher ---
document.getElementById("voucher").addEventListener("input", updatePrice);

// --- Toast ---
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastIcon = document.getElementById("toastIcon");
  const toastMsg = document.getElementById("toastMsg");

  toastMsg.innerText = message;
  
  if (type === "success") {
    toast.className = "toast show success";
    toastIcon.innerText = "✔️";
  } else if (type === "error") {
    toast.className = "toast show error";
    toastIcon.innerText = "⚠️";
  }

  // Hilang setelah 3 detik
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// --- Checkout ---
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const gameID = document.getElementById("idgame").value.trim();
  const voucher = document.getElementById("voucher").value.trim().toUpperCase();

  if (!gameID) {
    showToast("Masukkan ID Game dulu!", "error");
    return;
  }
  if (!selectedPackage) {
    showToast("Silakan pilih paket!", "error");
    return;
  }

  let total = selectedPackage.price;
  if (voucher === "WLZSPR") {
    total = total * 0.9;
  }

  showToast(`Checkout: ${selectedPackage.name} | Rp ${total.toLocaleString()}`, "success");
});
