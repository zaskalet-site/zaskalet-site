const messages = {
  games: "Great meeting you at Games of the Future. Let’s stay in touch.",
  radio: "73 — great to meet another radio amateur. Let’s stay in touch.",
  business: "Thank you for connecting. I look forward to staying in touch.",
  colleague: "It was good to reconnect after our earlier work together.",
  friends: "Great to meet through friends. Let’s stay in touch.",
  online: "Thanks for connecting online.",
  other: "Great meeting you. Let’s stay in touch."
};

const contextBlock = document.getElementById("contextBlock");
const connectBlock = document.getElementById("connectBlock");
const contextMessage = document.getElementById("contextMessage");

function selectContext(key) {
  contextMessage.textContent = messages[key] || messages.other;
  contextBlock.classList.add("hidden");
  connectBlock.classList.remove("hidden");
  try { localStorage.setItem("meetContext", key); } catch (_) {}
}

document.querySelectorAll("[data-context]").forEach((button) => {
  button.addEventListener("click", () => selectContext(button.dataset.context));
});

document.getElementById("changeContext").addEventListener("click", () => {
  connectBlock.classList.add("hidden");
  contextBlock.classList.remove("hidden");
});

document.getElementById("emailButton").addEventListener("click", () => {
  const local = "m";
  const domain = "zaskalet.com";
  window.location.href = `mailto:${local}@${domain}?subject=Nice%20to%20meet%20you`;
});

try {
  const saved = localStorage.getItem("meetContext");
  if (saved) selectContext(saved);
} catch (_) {}
