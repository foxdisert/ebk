/* =========================================================================
   ⚙️  CONFIG — EDIT THIS BLOCK ONLY
   ========================================================================= */
const CONFIG = {
  // Your PocketsFlow username / subdomain. This drives everything:
  //  - products are loaded from  api.pocketsflow.com/creator-pages/products/<username>
  //  - each "Buy" button opens   <username>.pocketsflow.com/<product-slug>
  // Add a new ebook in PocketsFlow → it appears here automatically. No code changes.
  username: "morsar",

  // --- Branding / header ---
  brandName: "Morsar",
  headline: "No-fluff guides for people who build.",
  tagline:
    "Practical, step-by-step playbooks that turn complicated tech businesses into clear actions — so you can skip the guesswork and start shipping.",

  // Optional: links shown in the footer (leave a value empty to hide it)
  social: {
    twitter: "",
    instagram: "",
    youtube: "",
    website: "",
  },

  // --- Advanced (rarely need to change) ---
  apiBase: "https://api.pocketsflow.com",
  checkoutBase: "", // leave "" to auto-build https://<username>.pocketsflow.com
};

/* =========================================================================
   ⬇️  No need to edit below this line.
   ========================================================================= */
(function () {
  "use strict";

  const checkoutBase =
    CONFIG.checkoutBase || `https://${CONFIG.username}.pocketsflow.com`;

  // ---- Fill static branding text ----
  const setText = (sel, value) =>
    document.querySelectorAll(sel).forEach((el) => {
      if (value) el.textContent = value;
    });
  setText("[data-brand]", CONFIG.brandName);
  setText("[data-headline]", CONFIG.headline);
  setText("[data-tagline]", CONFIG.tagline);
  setText("[data-year]", String(new Date().getFullYear()));
  setText("[data-avatar-initial]", (CONFIG.brandName || "?").charAt(0).toUpperCase());

  // ---- Footer social links ----
  const socialWrap = document.querySelector("[data-social]");
  if (socialWrap) {
    const labels = { twitter: "Twitter / X", instagram: "Instagram", youtube: "YouTube", website: "Website" };
    Object.entries(CONFIG.social || {}).forEach(([k, url]) => {
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = labels[k] || k;
      socialWrap.appendChild(a);
    });
  }

  // ---- Helpers ----
  const escapeHtml = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  function formatPrice(p) {
    const price = Number(p.price) || 0;
    const min = Number(p.minPrice) || 0;
    const fmt = (n) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`);
    if (p.payWant) return min > 0 ? `${fmt(min)}+` : "Name your price";
    if (price === 0) return "Free";
    return fmt(price);
  }

  function productCard(p) {
    const url = `${checkoutBase}/${encodeURIComponent(p.slug || "")}`;
    const title = escapeHtml(p.name);
    const subtitle = escapeHtml(p.subtitle || "");
    const price = escapeHtml(formatPrice(p));
    const thumb = p.thumbnail
      ? `<img class="card-thumb" src="${escapeHtml(p.thumbnail)}" alt="${title}" loading="lazy" />`
      : `<div class="card-thumb card-thumb--empty"><span>${title}</span></div>`;

    return `
      <article class="product-card">
        <a class="card-media" href="${url}" aria-label="${title}">
          ${thumb}
          <span class="price-tag">${price}</span>
        </a>
        <div class="card-body">
          <h3 class="card-title"><a href="${url}">${title}</a></h3>
          ${subtitle ? `<p class="card-sub">${subtitle}</p>` : ""}
          <a class="btn btn-buy" href="${url}">
            Buy this
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </article>`;
  }

  // ---- Load + render products ----
  const grid = document.querySelector("[data-grid]");
  const countEl = document.querySelector("[data-count]");

  function setState(html) {
    if (grid) grid.innerHTML = html;
  }

  function skeletons(n = 3) {
    return Array.from({ length: n })
      .map(
        () =>
          `<div class="product-card skel"><div class="card-media skel-box"></div><div class="card-body"><div class="skel-line"></div><div class="skel-line short"></div></div></div>`
      )
      .join("");
  }

  async function loadProducts() {
    setState(skeletons());
    try {
      const res = await fetch(
        `${CONFIG.apiBase}/creator-pages/products/${encodeURIComponent(CONFIG.username)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const products = (data.products || []).filter(
        (p) => p.published !== false && p.slug
      );

      if (countEl)
        countEl.textContent = `${products.length} book${products.length === 1 ? "" : "s"}`;

      if (!products.length) {
        setState(
          `<div class="state"><h3>No products yet</h3><p>New ebooks you publish on PocketsFlow will show up here automatically.</p></div>`
        );
        return;
      }
      setState(products.map(productCard).join(""));
    } catch (err) {
      console.error("Failed to load products:", err);
      setState(
        `<div class="state state--error">
           <h3>Couldn't load the store</h3>
           <p>Please refresh the page. If it keeps happening, check your connection.</p>
           <button class="btn btn-buy" data-retry>Try again</button>
         </div>`
      );
      const retry = grid && grid.querySelector("[data-retry]");
      if (retry) retry.addEventListener("click", loadProducts);
    }
  }

  loadProducts();

  // ---- Mobile nav ----
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
