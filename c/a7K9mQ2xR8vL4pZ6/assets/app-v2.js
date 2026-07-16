
(() => {
  const cfg = window.CARD_CONFIG || {};
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  $$("[data-open]").forEach(btn => btn.addEventListener("click", () => {
    const d = document.getElementById(btn.dataset.open);
    if (d) d.showModal();
  }));

  $$("dialog .close").forEach(btn =>
    btn.addEventListener("click", () => btn.closest("dialog").close())
  );

  $$("dialog").forEach(d => d.addEventListener("click", e => {
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom) d.close();
  }));

  const makeVCard = () => {
    const lines = [
      "BEGIN:VCARD","VERSION:3.0",
      "FN:Mikhail Zaskalet",
      "N:Zaskalet;Mikhail;;;",
      "TITLE:Technology Entrepreneur",
      `EMAIL;TYPE=INTERNET:${cfg.gamingEmail}`,
      `EMAIL;TYPE=INTERNET:${cfg.amateurRadioEmail}`,
      `URL;TYPE=LinkedIn:${cfg.linkedin}`,
      `URL;TYPE=Facebook:${cfg.facebook}`,
      `URL;TYPE=Instagram:${cfg.instagram}`,
      `URL;TYPE=WhatsApp:${cfg.whatsapp}`,
      `URL;TYPE=Telegram:${cfg.telegram}`,
      `NOTE:Amateur Radio callsign: ${cfg.amateurRadioCallsign}; Discord: ${cfg.discordUsername}`,
      "END:VCARD"
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([lines], {type:"text/vcard;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Mikhail-Zaskalet.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
  };

  $("#saveContact").addEventListener("click", makeVCard);

  const items = {
    linkedin:{label:"LinkedIn",description:"Professional profile",icon:"in",href:()=>cfg.linkedin},
    whatsapp:{label:"WhatsApp",description:"Fastest way to reach me",icon:"WA",href:()=>cfg.whatsapp},
    facebook:{label:"Facebook",description:"Personal updates",icon:"f",href:()=>cfg.facebook},
    instagram:{label:"Instagram",description:`Follow ${cfg.instagramHandle}`,icon:"◎",href:()=>cfg.instagram},
    telegram:{label:"Telegram",description:cfg.telegramHandle,icon:"TG",href:()=>cfg.telegram},
    gamingEmail:{label:"Gaming email",description:cfg.gamingEmail,icon:"✉",href:()=>`mailto:${cfg.gamingEmail}`},
    radioEmail:{label:"Amateur Radio email",description:cfg.amateurRadioEmail,icon:"✉",href:()=>`mailto:${cfg.amateurRadioEmail}`},
    callsign:{label:"Amateur Radio",description:`Callsign ${cfg.amateurRadioCallsign}`,icon:"📡",copy:()=>cfg.amateurRadioCallsign},
    discord:{label:"Discord",description:`Username: ${cfg.discordUsername}`,icon:"DC",copy:()=>cfg.discordUsername}
  };

  const map = {
    "Business":["linkedin","whatsapp","telegram","facebook","instagram"],
    "Former colleague":["linkedin","whatsapp","facebook","instagram","telegram"],
    "Amateur Radio":["callsign","radioEmail","whatsapp","telegram"],
    "Gaming":["discord","gamingEmail","instagram","telegram"],
    "Shared interests":["instagram","facebook","linkedin","whatsapp","telegram"],
    "Personal":["whatsapp","telegram","instagram","facebook"],
    "Other":["linkedin","whatsapp","telegram","facebook","instagram","gamingEmail","radioEmail","discord","callsign"]
  };

  const makeEntry = key => {
    const item = items[key];
    if (!item) return null;
    const href = item.href ? item.href() : "";
    const value = item.copy ? item.copy() : "";

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
          await navigator.clipboard.writeText(value);
          const action = el.querySelector(".entry-action");
          const old = action.textContent;
          action.textContent = "Copied";
          setTimeout(()=>action.textContent=old,1200);
        } catch {
          alert(value);
        }
      });
    }

    el.innerHTML = `
      <span class="entry-icon">${item.icon}</span>
      <span class="entry-copy">
        <strong>${item.label}</strong>
        <small>${item.description}</small>
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

    (map[context] || map.Other).forEach(key => {
      const el = makeEntry(key);
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
      cfg.shareDetailsRecipient;

    const subject = `My contact details — ${f.get("name")}`;
    const body = [
      `Name: ${f.get("name")}`,
      `Company / Organization: ${f.get("company") || "—"}`,
      `Email or messenger: ${f.get("contact")}`,
      `How we know each other: ${context}`,
      "",
      f.get("message") || ""
    ].join("\n");

    location.href =
      `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
