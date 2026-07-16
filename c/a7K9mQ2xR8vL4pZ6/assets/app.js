(() => {
  const cfg = window.CARD_CONFIG || {};
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  $$("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const d = document.getElementById(btn.dataset.open);
      if (d) d.showModal();
    });
  });

  $$("dialog .close").forEach(btn =>
    btn.addEventListener("click", () => btn.closest("dialog").close())
  );

  $$("dialog").forEach(d => d.addEventListener("click", e => {
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom) d.close();
  }));

  const escapeVCard = value => String(value || "")
    .replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
    .replace(/,/g, "\\,").replace(/;/g, "\\;");

  const makeVCard = () => {
    const fullName = cfg.fullName || "Mikhail Zaskalet";
    const parts = fullName.trim().split(/\s+/);
    const first = parts.shift() || "";
    const last = parts.join(" ");
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${escapeVCard(fullName)}`,
      `N:${escapeVCard(last)};${escapeVCard(first)};;;`,
      cfg.organization ? `ORG:${escapeVCard(cfg.organization)}` : "",
      cfg.title ? `TITLE:${escapeVCard(cfg.title)}` : "",
      cfg.phone ? `TEL;TYPE=CELL:${cfg.phone}` : "",
      cfg.linkedin ? `URL;TYPE=LinkedIn:${cfg.linkedin}` : "",
      cfg.facebook ? `URL;TYPE=Facebook:${cfg.facebook}` : "",
      cfg.instagram ? `URL;TYPE=Instagram:${cfg.instagram}` : "",
      cfg.whatsapp ? `URL;TYPE=WhatsApp:${cfg.whatsapp}` : "",
      cfg.telegram ? `URL;TYPE=Telegram:${cfg.telegram}` : "",
      cfg.gamingEmail ? `EMAIL;TYPE=INTERNET:${cfg.gamingEmail}` : "",
      cfg.amateurRadioEmail ? `EMAIL;TYPE=INTERNET:${cfg.amateurRadioEmail}` : "",
      cfg.amateurRadioCallsign ? `NOTE:Amateur Radio callsign: ${cfg.amateurRadioCallsign}; Discord: ${cfg.discordUsername || ""}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([lines], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Mikhail-Zaskalet.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };

  $("#saveContact").addEventListener("click", makeVCard);

  const entries = {
    linkedin: {
      label: "LinkedIn",
      description: "Professional profile",
      icon: "in",
      href: () => cfg.linkedin
    },
    whatsapp: {
      label: "WhatsApp",
      description: "Fastest way to reach me",
      icon: "WA",
      href: () => cfg.whatsapp
    },
    facebook: {
      label: "Facebook",
      description: "Personal updates",
      icon: "f",
      href: () => cfg.facebook
    },
    instagram: {
      label: "Instagram",
      description: cfg.instagramHandle ? `Follow ${cfg.instagramHandle}` : "Photos and updates",
      icon: "◎",
      href: () => cfg.instagram
    },
    telegram: {
      label: "Telegram",
      description: cfg.telegramHandle || "Message me on Telegram",
      icon: "TG",
      href: () => cfg.telegram
    },
    gamingEmail: {
      label: "Gaming email",
      description: cfg.gamingEmail,
      icon: "✉",
      href: context => cfg.gamingEmail
        ? `mailto:${cfg.gamingEmail}?subject=${encodeURIComponent("Hello Mikhail — " + context)}`
        : ""
    },
    radioEmail: {
      label: "Amateur Radio email",
      description: cfg.amateurRadioEmail,
      icon: "✉",
      href: context => cfg.amateurRadioEmail
        ? `mailto:${cfg.amateurRadioEmail}?subject=${encodeURIComponent("Hello Mikhail — Amateur Radio")}`
        : ""
    },
    callsign: {
      label: "Amateur Radio",
      description: cfg.amateurRadioCallsign ? `Callsign ${cfg.amateurRadioCallsign}` : "",
      icon: "📡",
      copy: () => cfg.amateurRadioCallsign
    },
    discord: {
      label: "Discord",
      description: cfg.discordUsername ? `Username: ${cfg.discordUsername}` : "",
      icon: "DC",
      copy: () => cfg.discordUsername
    }
  };

  const categoryMap = {
    "Business": ["linkedin", "whatsapp", "telegram", "facebook", "instagram"],
    "Former colleague": ["linkedin", "whatsapp", "facebook", "instagram", "telegram"],
    "Amateur Radio": ["callsign", "radioEmail", "whatsapp", "telegram"],
    "Gaming": ["discord", "gamingEmail", "instagram", "telegram"],
    "Shared interests": ["instagram", "facebook", "linkedin", "whatsapp", "telegram"],
    "Personal": ["whatsapp", "telegram", "instagram", "facebook"],
    "Other": ["linkedin", "whatsapp", "telegram", "facebook", "instagram", "gamingEmail", "radioEmail", "discord", "callsign"]
  };

  const createEntry = (key, context) => {
    const item = entries[key];
    if (!item) return null;

    const href = item.href ? item.href(context) : "";
    const copyValue = item.copy ? item.copy() : "";
    if (!href && !copyValue) return null;

    const el = document.createElement(href ? "a" : "button");
    el.className = "contact-entry";
    if (href) {
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else {
      el.type = "button";
      el.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(copyValue);
          const old = el.querySelector(".entry-action").textContent;
          el.querySelector(".entry-action").textContent = "Copied";
          setTimeout(() => el.querySelector(".entry-action").textContent = old, 1400);
        } catch {
          alert(copyValue);
        }
      });
    }

    el.innerHTML = `
      <span class="entry-icon">${item.icon}</span>
      <span class="entry-copy">
        <strong>${item.label}</strong>
        <small>${item.description || ""}</small>
      </span>
      <span class="entry-action">${href ? "→" : "Copy"}</span>
    `;
    return el;
  };

  $$("#contextGrid button").forEach(btn => btn.addEventListener("click", () => {
    const context = btn.dataset.context;
    const wrap = $("#contactLinks");
    wrap.innerHTML = `
      <div class="context-title">
        <strong>${context}</strong>
        <small>Great to connect. Choose how you'd like to reach me.</small>
      </div>
    `;

    (categoryMap[context] || categoryMap.Other).forEach(key => {
      const el = createEntry(key, context);
      if (el) wrap.appendChild(el);
    });

    const back = document.createElement("button");
    back.className = "back";
    back.type = "button";
    back.textContent = "← Back";
    back.addEventListener("click", () => {
      wrap.hidden = true;
      $("#contextGrid").hidden = false;
    });
    wrap.appendChild(back);

    $("#contextGrid").hidden = true;
    wrap.hidden = false;
  }));

  $("#shareForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const context = String(f.get("context") || "");
    const recipient =
      context === "Amateur Radio" ? cfg.amateurRadioEmail :
      context === "Gaming" ? cfg.gamingEmail :
      cfg.shareDetailsRecipient || cfg.gamingEmail || cfg.amateurRadioEmail;

    const subject = `My contact details — ${f.get("name")}`;
    const body = [
      `Name: ${f.get("name")}`,
      `Company / Organization: ${f.get("company") || "—"}`,
      `Email or messenger: ${f.get("contact")}`,
      `How we know each other: ${context}`,
      "",
      f.get("message") || ""
    ].join("\n");

    if (!recipient) {
      navigator.clipboard?.writeText(body);
      alert("No recipient email is configured. The prepared message was copied.");
      return;
    }

    location.href =
      `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
