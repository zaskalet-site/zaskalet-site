const C = window.ZASKALET_CONTACTS || {};

const categories = {
  business: {
    kicker: "BUSINESS",
    title: "Professional contact",
    description: "For business, partnerships, projects, and professional conversations.",
    facts: [],
    links: [
      { icon:"in", label:"LinkedIn", note:"Professional profile", href:C.linkedin },
      { icon:"✉", label:"Email", note:C.email || "", href:C.email ? `mailto:${C.email}` : "" },
      { icon:"◉", label:"WhatsApp", note:"Direct message", href:C.whatsapp }
    ]
  },
  interests: {
    kicker: "INTERESTS",
    title: "Shared interests",
    description: "For technology, AI, engineering, and other shared interests.",
    facts: [],
    links: [
      { icon:"◈", label:"Discord", note:"Connect on Discord", href:C.discord },
      { icon:"✉", label:"Email", note:C.email || "", href:C.email ? `mailto:${C.email}` : "" }
    ]
  },
  radio: {
    kicker: "AMATEUR RADIO",
    title: "On the air",
    description: "For amateur radio contacts and radio-related conversations.",
    facts: [
      { label:"Callsign", value:C.callsign }
    ],
    links: [
      { icon:"◉", label:"QRZ.com", note:C.callsign || "", href:C.qrz },
      { icon:"✉", label:"Email", note:C.email || "", href:C.email ? `mailto:${C.email}` : "" }
    ]
  },
  gaming: {
    kicker: "GAMING",
    title: "Gaming contact",
    description: "For PUBG, esports, gaming communities, and related projects.",
    facts: [
      { label:"Nickname", value:C.gamingNickname }
    ],
    links: [
      { icon:"◈", label:"Discord", note:"Connect on Discord", href:C.discord },
      { icon:"✉", label:"Email", note:C.email || "", href:C.email ? `mailto:${C.email}` : "" }
    ]
  },
  personal: {
    kicker: "PERSONAL",
    title: "Stay in touch",
    description: "For friends and personal connections.",
    facts: [],
    links: [
      { icon:"◎", label:"Instagram", note:"Social profile", href:C.instagram },
      { icon:"f", label:"Facebook", note:"Social profile", href:C.facebook },
      { icon:"◉", label:"WhatsApp", note:"Direct message", href:C.whatsapp },
      { icon:"➤", label:"Telegram", note:"Direct message", href:C.telegram }
    ]
  },
  other: {
    kicker: "OTHER",
    title: "Get in touch",
    description: "For anything that does not fit the categories above.",
    facts: [],
    links: [
      { icon:"✉", label:"Email", note:C.email || "", href:C.email ? `mailto:${C.email}` : "" }
    ]
  }
};

const categoryScreen = document.getElementById("categoryScreen");
const contactScreen = document.getElementById("contactScreen");
const kicker = document.getElementById("categoryKicker");
const title = document.getElementById("categoryTitle");
const description = document.getElementById("categoryDescription");
const facts = document.getElementById("identityFacts");
const links = document.getElementById("contactLinks");

function safeExternalLink(anchor, href) {
  anchor.href = href;
  if (!href.startsWith("mailto:")) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
}

function openCategory(key) {
  const category = categories[key];
  if (!category) return;

  kicker.textContent = category.kicker;
  title.textContent = category.title;
  description.textContent = category.description;

  facts.innerHTML = "";
  const visibleFacts = (category.facts || []).filter(item => item.value);
  facts.classList.toggle("hidden", visibleFacts.length === 0);
  visibleFacts.forEach(item => {
    const row = document.createElement("div");
    row.className = "fact";
    row.innerHTML = `<span>${item.label}</span><span>${item.value}</span>`;
    facts.appendChild(row);
  });

  links.innerHTML = "";
  (category.links || []).filter(item => item.href).forEach(item => {
    const a = document.createElement("a");
    a.className = "contact-link";
    safeExternalLink(a, item.href);
    a.innerHTML = `
      <span class="link-main">
        <span aria-hidden="true">${item.icon}</span>
        <span>
          <span class="link-label">${item.label}</span>
          <span class="link-note">${item.note || ""}</span>
        </span>
      </span>
      <span aria-hidden="true">↗</span>`;
    links.appendChild(a);
  });

  categoryScreen.classList.add("hidden");
  contactScreen.classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => openCategory(button.dataset.category));
});

document.getElementById("backButton").addEventListener("click", () => {
  contactScreen.classList.add("hidden");
  categoryScreen.classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});
