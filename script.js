// Elements
const gameCards = document.querySelectorAll(".game-card");
const diamondCards = document.querySelectorAll(".diamond-card");
const paymentCards = document.querySelectorAll(".payment-card");
const checkoutBtn = document.getElementById("checkoutBtn");

const userIdInput = document.getElementById("userId");
const serverIdGroup = document.getElementById("serverIdGroup");
const serverIdInput = document.getElementById("serverId");

let selectedGame = "";
let selectedDiamond = "";
let selectedPayment = "";

// Games with server ID requirement
const gamesWithServer = ["Mobile Legends", "Honor of Kings", "Genshin Impact"];

// Game selection
gameCards.forEach(card => {
  card.addEventListener("click", () => {
    gameCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedGame = card.dataset.game;

    // Show/hide server ID
    if (gamesWithServer.includes(selectedGame)) {
      serverIdGroup.classList.remove("hidden");
    } else {
      serverIdGroup.classList.add("hidden");
    }
  });
});

// Diamond selection
diamondCards.forEach(card => {
  card.addEventListener("click", () => {
    diamondCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedDiamond = card.dataset.amount;
  });
});

// Payment selection
paymentCards.forEach(card => {
  card.addEventListener("click", () => {
    paymentCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedPayment = card.dataset.method;
  });
});

// Checkout
checkoutBtn.addEventListener("click", () => {
  const userId = userIdInput.value.trim();
  const serverId = serverIdInput.value.trim();

  if (!selectedGame || !userId || !selectedDiamond || !selectedPayment) {
    alert("Mohon lengkapi semua data sebelum checkout.");
    return;
  }

  let message = `Halo Admin, saya ingin top up:\n\n🎮 Game: ${selectedGame}\n🆔 ID: ${userId}`;
  if (gamesWithServer.includes(selectedGame)) {
    message += `\n🌐 Server ID: ${serverId}`;
  }
  message += `\n💎 Diamond: ${selectedDiamond}\n💳 Pembayaran: ${selectedPayment}`;

  const waUrl = `https://wa.me/6282298902274?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
});