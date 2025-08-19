// DATA GAME + DIAMOND + HARGA
const games = {
  "freefire": {
    name: "Free Fire",
    image: "https://files.catbox.moe/x5rvpg.jpg",
    diamonds: [
      {id: 1, jumlah: "5 Diamond", harga: 1000},
      {id: 2, jumlah: "50 Diamond", harga: 8000},
      {id: 3, jumlah: "100 Diamond", harga: 15000},
      {id: 4, jumlah: "500 Diamond", harga: 70000},
      {id: 5, jumlah: "1000 Diamond", harga: 135000}
    ]
  },
  "mobilelegends": {
    name: "Mobile Legends",
    image: "https://files.catbox.moe/wcxi20.jpg",
    hasServer: true,
    diamonds: [
      {id: 1, jumlah: "86 Diamond", harga: 20000},
      {id: 2, jumlah: "172 Diamond", harga: 38000},
      {id: 3, jumlah: "257 Diamond", harga: 56000},
      {id: 4, jumlah: "514 Diamond", harga: 111000}
    ]
  },
  "honorofkings": {
    name: "Honor of Kings",
    image: "https://files.catbox.moe/rh78kj.jpg",
    diamonds: [
      {id: 1, jumlah: "50 Token", harga: 12000},
      {id: 2, jumlah: "100 Token", harga: 23000},
      {id: 3, jumlah: "500 Token", harga: 110000}
    ]
  },
  "genshinimpact": {
    name: "Genshin Impact",
    image: "https://files.catbox.moe/b91rfb.jpg",
    hasServer: true,
    diamonds: [
      {id: 1, jumlah: "60 Genesis Crystal", harga: 12000},
      {id: 2, jumlah: "300+30 Genesis Crystal", harga: 59000},
      {id: 3, jumlah: "980+110 Genesis Crystal", harga: 179000}
    ]
  },
  "roblox": {
    name: "Roblox",
    image: "https://files.catbox.moe/uvixa8.jpg",
    diamonds: [
      {id: 1, jumlah: "80 Robux", harga: 12000},
      {id: 2, jumlah: "400 Robux", harga: 59000},
      {id: 3, jumlah: "1000 Robux", harga: 149000}
    ]
  },
  "stumbleguys": {
    name: "Stumble Guys",
    image: "https://files.catbox.moe/712fja.jpg",
    diamonds: [
      {id: 1, jumlah: "250 Token", harga: 15000},
      {id: 2, jumlah: "800 Token", harga: 45000},
      {id: 3, jumlah: "1600 Token", harga: 89000}
    ]
  }
};

// PEMBAYARAN
const payments = [
  {id: "qris", name: "QRIS", image: "https://files.catbox.moe/crlcvj.jpg"},
  {id: "dana", name: "Dana", image: "https://files.catbox.moe/f5ey4y.jpg"},
  {id: "gopay", name: "GoPay", image: "https://files.catbox.moe/je0irt.jpg"},
  {id: "ovo", name: "OVO", image: "https://files.catbox.moe/57f44a.jpg"},
  {id: "shopeepay", name: "ShopeePay", image: "https://files.catbox.moe/gub7ik.jpg"}
];

// GET GAME SELECTED
const params = new URLSearchParams(window.location.search);
const gameKey = params.get("game");
const game = games[gameKey];

if(game){
  document.getElementById("selectedGameImage").src = game.image;
  document.getElementById("selectedGameName").textContent = game.name;
  if(game.hasServer){
    document.getElementById("serverIdGroup").style.display = "block";
  }

  // LOAD DIAMONDS
  const diamondList = document.getElementById("diamondList");
  game.diamonds.forEach(d => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.dataset.id = d.id;
    div.dataset.jumlah = d.jumlah;
    div.dataset.harga = d.harga;
    div.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/2762/2762885.png" alt="Diamond"><p>${d.jumlah}</p><p>Rp${d.harga.toLocaleString()}</p>`;
    div.addEventListener("click", ()=>{
      document.querySelectorAll(".product-item").forEach(i=>i.classList.remove("selected"));
      div.classList.add("selected");
    });
    diamondList.appendChild(div);
  });

  // LOAD PAYMENT
  const paymentList = document.getElementById("paymentList");
  payments.forEach(p=>{
    const div = document.createElement("div");
    div.className = "payment-item";
    div.dataset.id = p.id;
    div.dataset.name = p.name;
    div.innerHTML = `<img src="${p.image}" alt="${p.name}" width="50"><p>${p.name}</p>`;
    div.addEventListener("click", ()=>{
      document.querySelectorAll(".payment-item").forEach(i=>i.classList.remove("selected"));
      div.classList.add("selected");
    });
    paymentList.appendChild(div);
  });
}

// HANDLE FORM
document.getElementById("topupForm").addEventListener("submit", function(e){
  e.preventDefault();
  const id = document.getElementById("gameId").value.trim();
  const serverId = document.getElementById("serverId").value.trim();
  const diamond = document.querySelector(".product-item.selected");
  const payment = document.querySelector(".payment-item.selected");
  const voucher = document.getElementById("voucher").value.trim();

  if(!id){alert("Kolom ID Game belum diisi!"); return;}
  if(game.hasServer && !serverId){alert("Kolom Server ID belum diisi!"); return;}
  if(!diamond){alert("Pilih jumlah diamond terlebih dahulu!"); return;}
  if(!payment){alert("Pilih metode pembayaran terlebih dahulu!"); return;}

  const jumlah = diamond.dataset.jumlah;
  const harga = parseInt(diamond.dataset.harga);
  const bayar = harga; // bisa tambah diskon voucher di sini

  const detail = `
    <p><strong>Game:</strong> ${game.name}</p>
    <p><strong>ID:</strong> ${id}${game.hasServer ? " ("+serverId+")" : ""}</p>
    <p><strong>Produk:</strong> ${jumlah}</p>
    <p><strong>Metode:</strong> ${payment.dataset.name}</p>
    <p><strong>Total Bayar:</strong> Rp${bayar.toLocaleString()}</p>
  `;

  document.getElementById("transactionDetails").innerHTML = detail;
  document.getElementById("transactionPopup").style.display = "flex";

  const waText = `Halo, saya ingin top up:\n\nGame: ${game.name}\nID: ${id}${game.hasServer ? " ("+serverId+")" : ""}\nProduk: ${jumlah}\nMetode: ${payment.dataset.name}\nTotal Bayar: Rp${bayar.toLocaleString()}`;
  document.getElementById("waCheckout").href = `https://wa.me/6282298902274?text=${encodeURIComponent(waText)}`;
});

// CLOSE POPUP
document.getElementById("closePopup").addEventListener("click", ()=>{
  document.getElementById("transactionPopup").style.display = "none";
});