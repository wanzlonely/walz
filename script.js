// PILIH PAKET
const packages = document.querySelectorAll('.flip-card');
const stickyPrice = document.createElement('div');
stickyPrice.id = 'stickyPrice';
document.body.insertBefore(stickyPrice, document.body.firstChild);

let selectedPackagePrice = 0;

packages.forEach(pkg => {
  pkg.addEventListener('click', () => {
    // Reset semua
    packages.forEach(p => p.classList.remove('selected'));
    // Pilih paket
    pkg.classList.add('selected');
    const priceText = pkg.querySelector('.pkg-price').innerText;
    selectedPackagePrice = priceText;
    stickyPrice.innerText = `Harga: ${selectedPackagePrice}`;
  });
});

// PILIH METODE PEMBAYARAN
const paymentOptions = document.querySelectorAll('.payment-method');
let selectedPayment = null;

paymentOptions.forEach(method => {
  method.addEventListener('click', () => {
    // Reset semua
    paymentOptions.forEach(m => m.classList.remove('selected'));
    // Pilih metode
    method.classList.add('selected');
    selectedPayment = method.querySelector('p').innerText;
  });
});

// CHECKOUT BUTTON
const checkoutBtn = document.getElementById('checkoutBtn');
const popup = document.getElementById('popupLoader');

checkoutBtn.addEventListener('click', () => {
  if (!selectedPackagePrice) {
    alert('Pilih paket terlebih dahulu!');
    return;
  }
  if (!selectedPayment) {
    alert('Pilih metode pembayaran!');
    return;
  }
  
  popup.classList.add('active');

  setTimeout(() => {
    popup.classList.remove('active');
    alert(`Top Up Berhasil!\nPaket: ${selectedPackagePrice}\nMetode: ${selectedPayment}`);
    // Reset
    packages.forEach(p => p.classList.remove('selected'));
    paymentOptions.forEach(m => m.classList.remove('selected'));
    stickyPrice.innerText = '';
    selectedPackagePrice = 0;
    selectedPayment = null;
  }, 2500);
});