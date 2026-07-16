
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
  $$("dialog .close").forEach(btn => btn.addEventListener("click", () => btn.closest("dialog").close()));
  $$("dialog").forEach(d => d.addEventListener("click", e => {
    const r=d.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();
  }));

  const makeVCard = () => {
    const lines = [
      "BEGIN:VCARD","VERSION:3.0",
      `FN:${cfg.fullName || "Mikhail Zaskalet"}`,
      `N:${(cfg.fullName || "Mikhail Zaskalet").split(" ").reverse().join(";")};;;`,
      cfg.organization ? `ORG:${cfg.organization}` : "",
      cfg.title ? `TITLE:${cfg.title}` : "",
      cfg.phone ? `TEL;TYPE=CELL:${cfg.phone}` : "",
      cfg.email ? `EMAIL;TYPE=INTERNET:${cfg.email}` : "",
      cfg.website ? `URL:${cfg.website}` : "",
      cfg.amateurRadioCallsign ? `NOTE:Amateur Radio: ${cfg.amateurRadioCallsign}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\r\n");
    const blob = new Blob([lines], {type:"text/vcard;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Mikhail-Zaskalet.vcf";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
  };
  $("#saveContact").addEventListener("click", makeVCard);

  const linksFor = (context) => {
    const items = [
      ["Email", cfg.email ? `mailto:${cfg.email}?subject=${encodeURIComponent("Hello Mikhail — " + context)}` : ""],
      ["WhatsApp", cfg.whatsapp ? `https://wa.me/${String(cfg.whatsapp).replace(/\D/g,"")}?text=${encodeURIComponent("Hello Mikhail, we met through: " + context)}` : ""],
      ["Telegram", cfg.telegram ? `https://t.me/${String(cfg.telegram).replace(/^@/,"")}` : ""],
      ["LinkedIn", cfg.linkedin || ""],
      ["Website", cfg.website || ""],
      ["Call", cfg.phone ? `tel:${cfg.phone}` : ""]
    ].filter(([,href])=>href);
    return items;
  };

  $$("#contextGrid button").forEach(btn => btn.addEventListener("click", () => {
    const context = btn.dataset.context;
    const wrap = $("#contactLinks");
    const items = linksFor(context);
    wrap.innerHTML = items.length
      ? items.map(([name,href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${name}<span style="margin-left:auto">→</span></a>`).join("")
      : `<p class="note">Contact links are not filled in yet. Edit <strong>assets/config.js</strong>.</p>`;
    wrap.insertAdjacentHTML("beforeend", `<button class="back" type="button">← Back</button>`);
    $("#contextGrid").hidden = true; wrap.hidden = false;
    $(".back",wrap).addEventListener("click",()=>{wrap.hidden=true;$("#contextGrid").hidden=false;});
  }));

  $("#shareForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const recipient = cfg.shareDetailsRecipient || cfg.email;
    const subject = `My contact details — ${f.get("name")}`;
    const body = [
      `Name: ${f.get("name")}`,
      `Company / Organization: ${f.get("company") || "—"}`,
      `Email or messenger: ${f.get("contact")}`,
      `How we know each other: ${f.get("context")}`,
      "",
      f.get("message") || ""
    ].join("\n");
    if (!recipient) {
      navigator.clipboard?.writeText(body);
      alert("Recipient email is not filled in assets/config.js. The prepared message was copied.");
      return;
    }
    location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
