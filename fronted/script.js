const chatBox = document.getElementById("chat-box");
const input = document.getElementById("prompt");
const sendBtn = document.getElementById("send");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const prompt = input.value.trim();
  if (!prompt) return;
  input.value = "";

  appendMessage("Kamu", prompt, "user");

  const typingEl = appendTyping();

  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    typingEl.remove();
    appendMessage("AI", data.output?.text || JSON.stringify(data, null, 2), "bot");
  } catch (err) {
    typingEl.remove();
    appendMessage("⚠️", "Gagal menghubungi server: " + err.message, "bot");
  }

  autoScroll();
}

function appendMessage(sender, text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(div);
  autoScroll();
}

function appendTyping() {
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.textContent = "AI sedang mengetik...";
  chatBox.appendChild(typing);
  autoScroll();
  return typing;
}

function autoScroll() {
  chatBox.scrollTop = chatBox.scrollHeight;
}
