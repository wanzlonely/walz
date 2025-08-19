const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('game');
const gameImg = urlParams.get('img');

document.getElementById('gameName').innerText = gameName;
document.getElementById('gameImage').src = gameImg;

// Tambahkan Server ID kalau game perlu
const serverGames = ["Mobile Legend","Honor of Kings"];
if (serverGames.includes(gameName)) {
  const div = document.getElementById('serverField');
  div.innerHTML = `
    <label for="serverId">Server ID</label>
    <input id="serverId" type="text" placeholder="Masukkan Server ID">
  `;
}

// Diamond Options
const diamondOptions = {
  "Free Fire":[
    {name:"50 💎",price:"Rp5.000"},
    {name:"100 💎",price:"Rp10.000"},
    {name:"210 💎",price:"Rp20.000"},
    {name:"530 💎",price:"Rp50.000"},
    {name:"1080 💎",price:"Rp95.000"},
    {name:"2200 💎",price:"Rp185.000"}
  ],
  "Mobile Legend":[
    {name:"86 💎",price:"Rp20.000"},
    {name:"172 💎",price:"Rp40.000"},
    {name:"257 💎",price:"Rp60.000"},
    {name:"344 💎",price:"Rp80.000"},
    {name:"514 💎",price:"Rp120.000"},
    {name:"1000 💎",price:"Rp230.000"},
    {name:"2010 💎",price:"Rp450.000"}
  ],
  "Honor of Kings":[
    {name:"100 💎",price:"Rp15.000"},
    {name:"300 💎",price:"Rp40.000"},
    {name:"600 💎",price:"Rp80.000"},
    {name:"1200 💎",price:"Rp150.000"},
    {name:"2400 💎",price:"Rp290.000"}
  ],
  "Genshin Impact":[
    {name:"60 💎",price:"Rp15.000"},
    {name:"300 💎",price:"Rp75.000"},
    {name:"980 💎",price:"Rp225.000"},
    {name:"1980 💎",price:"Rp450.000"},
    {name:"3280 💎",price:"Rp750.000"},
    {name:"6480 💎",price:"Rp1.500.000"}
  ],
  "Roblox":[
    {name:"80 💎",price:"Rp15.000"},
    {name:"400 💎",price:"Rp75.000"},
    {name:"800 💎",price:"Rp150.000"},
    {name:"1700 💎",price:"Rp300.000"},
    {name:"4500 💎",price:"Rp750.000"}
  ]
};

// Payment methods
const payments = [
  {name:"QRIS",img:"https://files.catbox.moe/crlcvj.jpg",price:"+ Rp1.000"},
  {name:"ShopeePay",img:"https://files.catbox.moe/gub7ik.jpg",price:"+ Rp1.500"},
  {name:"Dana",img:"https://files.catbox.moe/vzij14.jpg",price:"+ Rp1.500"},
  {name:"Gopay",img:"https://files.catbox.moe/hjxbgp.jpg",price:"+ Rp2.000"},
  {name:"Ovo",img:"https://files.catbox.moe/uy94ct.jpg",price:"+ Rp2.000"}
];

let selectedDiamond=null, selectedPayment=null;

// Render diamond
const diamondList=document.getElementById('diamondList');
diamondOptions[gameName].forEach((d,i)=>{
  const div=document.createElement('div');
  div.className='diamond-item fade-in';
  div.style.animationDelay=`${i*0.1}s`;
  div.innerHTML=`<p>${d.name}</p><span>${d.price}</span>`;
  div.onclick=()=>{
    document.querySelectorAll('.diamond-item').forEach(el=>el.classList.remove('selected'));
    div.classList.add('selected');
    selectedDiamond=d;
  };
  diamondList.appendChild(div);
});

// Render payment
const paymentList=document.getElementById('paymentList');
payments.forEach((p,i)=>{
  const div=document.createElement('div');
  div.className='payment-item fade-in';
  div.style.animationDelay=`${i*0.1}s`;
  div.innerHTML=`<img src="${p.img}"><p>${p.name}</p><span>${p.price}</span>`;
  div.onclick=()=>{
    document.querySelectorAll('.payment-item').forEach(el=>el.classList.remove('selected'));
    div.classList.add('selected');
    selectedPayment=p;
  };
  paymentList.appendChild(div);
});

// Checkout
document.getElementById('checkoutBtn').onclick=()=>{
  const uid=document.getElementById('userId').value;
  const sid=document.getElementById('serverId')?document.getElementById('serverId').value:null;
  if(!uid||!selectedDiamond||!selectedPayment){alert("Lengkapi data!");return;}
  let detail=`Game: ${gameName}\nUser ID: ${uid}`;
  if(sid) detail+=`\nServer ID: ${sid}`;
  detail+=`\nPaket: ${selectedDiamond.name} - ${selectedDiamond.price}\nBayar via: ${selectedPayment.name} ${selectedPayment.price}`;
  document.getElementById('popupText').innerText=detail;
  document.getElementById('popup').classList.add('active');
};

// Confirm → WhatsApp
document.getElementById('confirmBtn').onclick=()=>{
  const msg=encodeURIComponent(document.getElementById('popupText').innerText);
  const wa="6282298902274"; // Ganti nomor WhatsApp admin
  window.open(`https://wa.me/${wa}?text=${msg}`,'_blank');
  document.getElementById('popup').classList.remove('active');
};