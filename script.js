function generateChibi() {
  const input = document.getElementById('imageUpload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const file = input.files[0];

  if (!file) {
    alert("Pilih gambar dulu ya!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const minSize = Math.min(img.width, img.height);
      const sx = (img.width - minSize) / 2;
      const sy = (img.height - minSize) / 2;

      canvas.width = 300;
      canvas.height = 300;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'contrast(120%) saturate(150%) brightness(110%)';
      ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, canvas.width, canvas.height);

      // Tambahkan watermark WALZSHOP
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#00ffff';
      ctx.textAlign = 'center';
      ctx.fillText('WALZSHOP', canvas.width / 2, canvas.height - 10);

      canvas.style.display = 'block';

      // Buat preview grid
      generatePreviewGrid(canvas.toDataURL());
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function generatePreviewGrid(imageDataURL) {
  const grid = document.getElementById('previewGrid');
  grid.innerHTML = ''; // Clear previous

  for (let i = 0; i < 16; i++) {
    const img = document.createElement('img');
    img.src = imageDataURL;
    grid.appendChild(img);
  }
}

function downloadLogo() {
  const canvas = document.getElementById('canvas');
  const link = document.createElement('a');
  link.download = 'logo-chibi.png';
  link.href = canvas.toDataURL();
  link.click();
}

function shareWhatsApp() {
  const canvas = document.getElementById('canvas');
  const imageData = canvas.toDataURL('image/png');

  if (!imageData || canvas.style.display === 'none') {
    alert("Buat dulu logonya sebelum share!");
    return;
  }

  const text = encodeURIComponent("Cek logo chibi WALZSHOP-ku! 🔥");
  const waLink = `https://wa.me/?text=${text}`;
  window.open(waLink, '_blank');
}