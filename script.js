// DATA GAME
const games = [
  { id: 'ff', name: 'Free Fire', bg: 'https://files.catbox.moe/oqnxag.jpeg', logo: 'https://files.catbox.moe/oqnxag.jpeg' },
  { id: 'ml', name: 'Mobile Legends', bg: 'https://files.catbox.moe/h7whee.jpeg', logo: 'https://files.catbox.moe/h7whee.jpeg' },
  { id: 'hok', name: 'Honor of Kings', bg: 'https://files.catbox.moe/04zakl.jpeg', logo: 'https://files.catbox.moe/04zakl.jpeg' },
  { id: 'roblox', name: 'Roblox', bg: 'https://files.catbox.moe/ldegjz.png', logo: 'https://files.catbox.moe/ldegjz.png' }
];

// DATA PAKET
const harga = {
  ff: { "70 Diamonds": 9000, "140 Diamonds": 18000, "355 Diamonds": 45000, "720 Diamonds": 90000, "1450 Diamonds": 180000, "3000 Diamonds": 350000 },
  ml: { "86 Diamonds": 23000, "172 Diamonds": 45000, "514 Diamonds": 120000, "706 Diamonds": 160000, "1000 Diamonds": 220000, "2000 Diamonds": 400000 },
  hok: { "80 Tokens": 14000, "240 Tokens": 44000, "560 Tokens": 100000, "1200 Tokens": 210000, "2500 Tokens": 400000 },
  roblox: { "80 Robux": 12000, "400 Robux": 60000, "800 Robux": 115000, "1700 Robux": 230000, "4000 Robux": 500000 }
};

// DATA PAYMENT
const payments = [
  { id: 'gopay', name: 'GoPay', img: 'https://files.catbox.moe/7f7kj6.png' },
  { id: 'dana', name: 'Dana', img: 'https://files.catbox.moe/9ozprx.jpg' },
  { id: 'ovo', name: 'OVO', img: 'https://files.catbox.moe/0qmbo6.jpg' }
];

// SELECTED ITEMS
let selectedGame = null;
let selectedPackage = null;
let selectedPayment = null;

// PARTICLE CANVAS
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// POPUP LOADER
const popup = document.getElementById('popup');
function showPopup() { popup.classList.add('active'); }
function hidePopup() { popup.classList.remove('active'); }

// GENERATE GAME CARDS
const gameGrid = document.getElementById('gameGrid');
games.forEach(game => {
  const div = document.createElement('div');
  div.className = 'game-card';
  div.style.background = `url(${game.bg}) center/cover no-repeat`;
  div.innerHTML = `<div class="overlay"></div><img src="${game.logo}"><div>${game.name}</div>`;
  div.addEventListener('click', () => {
    document.querySelectorAll('.game-card').forEach(g => g.classList.remove('selected'));
    div.classList.add('selected');
    selectedGame = game.id;
    generatePackages(selectedGame);
    createParticles(div.offsetLeft + div.offsetWidth / 2, div.offsetTop + div.offsetHeight / 2, '#ff9800', 20);
  });
  gameGrid.appendChild(div);
  setTimeout(() => div.classList.add('visible'), 100);
});

// GENERATE PACKAGES
const packageGrid = document.getElementById('packageGrid');
function generatePackages(gameId) {
  packageGrid.innerHTML = '';
  const packs = harga[gameId];
  Object.keys(packs).forEach(key => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div>${key}</div>
          <div>Harga: ${packs[key]}</div>
        </div>
        <div class="flip-card-back">
          <button onclick="selectPackage('${gameId}', '${key}')">Pilih Paket</button>
        </div>
      </div>
    `;
    packageGrid.appendChild(card);
  });
}

// SELECT PACKAGE
function selectPackage(gameId, packageKey) {
  selectedPackage = { id: gameId, package: packageKey };
  alert(`Paket ${packageKey} untuk game ${games.find(g => g.id === gameId).name} telah dipilih!`);
}

// CREATE PARTICLES
function createParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const particle = {
      x: x,
      y: y,
      radius: Math.random() * 5 + 2,
      color: color,
      speed: Math.random() * 2 + 1,
      direction: Math.random() * 2 * Math.PI,
      alpha: 1
    };
    animateParticle(particle);
  }
}

function animateParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = particle.color;
  ctx.globalAlpha = particle.alpha;
  ctx.fill();
  ctx.closePath();

  particle.x += Math.cos(particle.direction) * particle.speed;
  particle.y += Math.sin(particle.direction) * particle.speed;
  particle.alpha -= 0.02; // Efek memudar

  if (particle.alpha > 0) {
    requestAnimationFrame(() => animateParticle(particle));
  }
}

// LOADING ANIMATION
function showLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
}