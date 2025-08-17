const form = document.getElementById("topupForm");
const popup = document.getElementById("popup");
const statusText = document.getElementById("statusText");
const riwayatList = document.getElementById("riwayatList");

// Load riwayat saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadRiwayat);

form.addEventListener("submit", function(e){
  e.preventDefault();

  const id = document.getElementById("gameId").value;
  const produk = document.getElementById("produk").value;
  const payment = document.getElementById("payment").value;
  const admin = "6281234567890"; // GANTI nomor WA kamu

  const pesan = `Halo Admin, saya mau order:\n\n🆔 ID: ${id}\n📦 Produk: ${produk}\n💳 Payment: ${payment}`;

  // Tampilkan popup
  popup.style.display = "flex";
  statusText.textContent = "Memproses pesanan...";

  // Simulasi proses
  setTimeout(() => {
    statusText.textContent = "✅ Pesanan Berhasil! Mengarahkan ke WhatsApp...";

    // Simpan riwayat order
    saveRiwayat({id, produk, payment, waktu: new Date().toLocaleString()});

    // Redirect ke WhatsApp
    setTimeout(() => {
      const url = `https://wa.me/${admin}?text=${encodeURIComponent(pesan)}`;
      window.open(url, "_blank");
      popup.style.display = "none";
    }, 1500);

  }, 2000);
});

// Simpan order ke localStorage
function saveRiwayat(order) {
  let data = JSON.parse(localStorage.getItem("riwayat")) || [];
  data.unshift(order);
  localStorage.setItem("riwayat", JSON.stringify(data));
  renderRiwayat();
}

// Render daftar riwayat
function renderRiwayat() {
  let data = JSON.parse(localStorage.getItem("riwayat")) || [];
  if (data.length === 0) {
    riwayatList.innerHTML = "<p>Belum ada riwayat order.</p>";
    return;
  }
  riwayatList.innerHTML = "";
  data.forEach(order => {
    const div = document.createElement("div");
    div.classList.add("riwayat-card");
    div.innerHTML = `
      <p>🆔 ID: <b>${order.id}</b></p>
      <p>📦 Produk: ${order.produk}</p>
      <p>💳 Payment: ${order.payment}</p>
      <p>⏰ Waktu: ${order.waktu}</p>
    `;
    riwayatList.appendChild(div);
  });
}

// Load riwayat di awal
function loadRiwayat() { renderRiwayat(); }

// Hapus semua riwayat
function clearRiwayat() {
  localStorage.removeItem("riwayat");
  renderRiwayat();
}
