const contextLabels = {
  business: "Business",
  colleague: "Former Colleague",
  radio: "Amateur Radio",
  friends: "Friends",
  games: "Games of the Future",
  online: "Online",
  other: "Other"
};

const contextMessages = {
  business: "Thank you for connecting. I look forward to staying in touch.",
  colleague: "It was good to reconnect after our earlier work together.",
  radio: "73 — great to meet another radio amateur.",
  friends: "Great to meet through friends.",
  games: "Great meeting you at Games of the Future.",
  online: "Thanks for connecting online.",
  other: "Great meeting you."
};

const contextBlock = document.getElementById("contextBlock");
const formBlock = document.getElementById("formBlock");
const sentBlock = document.getElementById("sentBlock");
const contextMessage = document.getElementById("contextMessage");
const meetingContext = document.getElementById("meetingContext");
const form = document.getElementById("contactForm");

function showContextForm(key) {
  meetingContext.value = key;
  contextMessage.textContent = contextMessages[key] || contextMessages.other;
  contextBlock.classList.add("hidden");
  sentBlock.classList.add("hidden");
  formBlock.classList.remove("hidden");
}

function resetCard() {
  form.reset();
  meetingContext.value = "";
  formBlock.classList.add("hidden");
  sentBlock.classList.add("hidden");
  contextBlock.classList.remove("hidden");
}

document.querySelectorAll("[data-context]").forEach((button) => {
  button.addEventListener("click", () => showContextForm(button.dataset.context));
});

document.getElementById("changeContext").addEventListener("click", resetCard);
document.getElementById("startAgain").addEventListener("click", resetCard);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const contextKey = String(data.get("meetingContext") || "other");
  const context = contextLabels[contextKey] || "Other";

  const subject = `New connection — ${context}`;
  const body = [
    `Name: ${data.get("name") || ""}`,
    `Company / Organization: ${data.get("company") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Telegram / LinkedIn: ${data.get("social") || ""}`,
    `Where we met: ${context}`,
    "",
    "Message:",
    `${data.get("message") || ""}`
  ].join("\n");

  const localPart = "m";
  const domain = "zaskalet.com";
  const mailto = `mailto:${localPart}@${domain}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  formBlock.classList.add("hidden");
  sentBlock.classList.remove("hidden");
});
