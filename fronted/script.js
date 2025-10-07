const form = document.getElementById('askForm');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = document.getElementById('prompt').value;
  output.textContent = 'Mengirim...';

  try {
    // Panggil proxy; proxy akan menambahkan Authorization header
    const resp = await fetch('/proxy/api/v1/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!resp.ok) {
      const text = await resp.text();
      output.textContent = `Error ${resp.status}: ${text}`;
      return;
    }

    const data = await resp.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Request failed: ' + err.message;
  }
});
