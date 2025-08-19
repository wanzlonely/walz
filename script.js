const params = new URLSearchParams(window.location.search);
const game = params.get("game");

// Data game
const games = {
  freefire: { title: "Free Fire", img: "https://files.catbox.moe/x5rvpg.jpg" },
  ml: { title: "Mobile Legends", img: "https://files.catbox.moe/wcxi20.jpg", server: true },
  hok: { title: "Honor of Kings", img: "https://files.catbox.moe/rh78kj.jpg", server: true },
  genshin: { title: "Genshin Impact", img: "https://files.catbox.moe/b91rfb.jpg" },
  roblox: { title: "Roblox", img: "https://files.catbox.moe/uvixa8.jpg" },
  stumble: { title: "Stumble Guys", img: "https://files.catbox.moe/712fja.jpg" }
};

// Data diamond
const diamonds = [
  { qty: "50", price: "10.000" },
  { qty: "100", price: "20.000" },
  { qty: "250", price: "45.000" },
  { qty: "500", price: "90.000" },
  { qty: "1000", price: "175.000" },
  { qty: "2000", price: "340.000" }
];

// Data pembayaran
const payments = [
  { name: "QRIS", img: "https://files.catbox.moe/crlcvj.jpg" },
  { name: "ShopeePay", img: "https://files.catbox.moe/gub7ik.jpg" },
  { name: "Dana", img: "https://files.catbox.moe/f5ey4y.jpg" },
  { name: "Gopay", img: "https://files.catbox.moe/je0irt.jpg" },
  { name: "OVO", img: "https://files.catbox.moe/57f44a.jpg" }
];

if (game && document.getElementById("gameTitle")) {
  const g = games[game];
  document.getElementById("gameTitle").textContent = g.title;
  document.getElementById("gameImage").src = g.img;

  if (g.server) {
    document.getElementById("serverField").style.display = "block";
  }

  // Diamond list
  const diamondList = document.getElementById("diamondList");
  diamonds.forEach(d => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/854/854878.png"><br>${d.qty} 💎<br><small>Rp ${d.price}</small>`;
    div.onclick = () => selectOption("diamond", d);
    diamondList.appendChild(div);
  });

  // Payment list
  const paymentList = document.getElementById("paymentList");
  payments.forEach(p => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `<img src="${p.img}"><br>${p.name}`;
    div.onclick = () => selectOption("payment", p);
    paymentList.appendChild(div);
  });
}

let selectedDiamond = null;
let selectedPayment = null;

function selectOption(type, data) {
  if (type === "diamond") {
    document.querySelectorAll("#diamondList .option").forEach(el => el.classList.remove("selected"));
    event.currentTarget.classList.add("selected");
    selectedDiamond = data;
  }
  if (type === "payment") {
    document.querySelectorAll("#paymentList .option").forEach(el => el.classList.remove("selected"));
    event.currentTarget.classList.add("selected");
    selectedPayment = data;
  }
}

// Checkout
document.getElementById("topupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("gameId").value;
  const serverId = document.getElementById("serverId")?.value || "-";
  const voucher = document.getElementById("voucher").value || "-";

  if (!selectedDiamond || !selectedPayment) {
    alert("Pilih diamond dan metode pembayaran!");
    return;
  }

  const summary = `
    Game: ${games[game].title}<br>
    ID: ${id} ${games[game].server ? "(Server: " + serverId + ")" : ""}<br>
    Diamond: ${selectedDiamond.qty} (Rp ${selectedDiamond.price})<br>
    Pembayaran: ${selectedPayment.name}<br>
    Voucher: ${voucher}
  `;
  document.getElementById("summary").innerHTML = summary;
  document.getElementById("popup").style.display = "flex";
});

function closePopup() {
  document.getElementById("popup").style.display = "none";
}