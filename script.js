/* ============================
   WALZSHOP - Neon UI Script
   ============================ */

// ---- GAME SEARCH (index.html) ----
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("game-search");
  const gameList = document.getElementById("game-list");

  if (searchInput && gameList) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const games = gameList.querySelectorAll(".game-card-custom");
      games.forEach((card) => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
      });
    });
  }

  // ---- THEME TOGGLE ----
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    let darkMode = true;
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      darkMode = !darkMode;
      themeBtn.innerHTML = darkMode
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
    });
  }

  // ---- CARD SELECTION EFFECT (game.html) ----
  const optionCards = document.querySelectorAll(".option-card");
  optionCards.forEach((card) => {
    card.addEventListener("click", () => {
      optionCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });

  // ---- NOTIFICATION POPUP ----
  const showNotification = (message, icon = "fa-check-circle") => {
    const container = document.createElement("div");
    container.className = "notification-container";

    const popup = document.createElement("div");
    popup.className = "notification-popup";
    popup.innerHTML = `<i class="fas ${icon} icon"></i><span class="message">${message}</span>`;

    container.appendChild(popup);
    document.body.appendChild(container);

    setTimeout(() => {
      popup.classList.add("fade-out");
      setTimeout(() => container.remove(), 600);
    }, 2500);
  };

  // ---- VOUCHER BUTTON (game.html) ----
  const voucherBtn = document.querySelector(".voucher-button");
  if (voucherBtn) {
    voucherBtn.addEventListener("click", () => {
      const input = document.querySelector(".voucher-input");
      if (!input.value) {
        showNotification("Masukkan kode voucher terlebih dahulu!", "fa-exclamation-circle");
      } else {
        showNotification("Voucher berhasil diterapkan!", "fa-ticket");
      }
    });
  }

  // ---- PARTICLE BACKGROUND (NEON GLOW) ----
  const createParticles = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const particles = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? "rgba(155, 92, 255, 0.8)" : "rgba(0, 255, 255, 0.7)",
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
  };

  createParticles();
});