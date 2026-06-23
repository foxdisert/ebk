# 🛒 Morsar — Ebook Storefront

A bold, Gumroad/comic-style storefront for selling your ebooks. It loads your
products **live from PocketsFlow**, so when you publish a new ebook it shows up
here automatically — no code changes, ever.

No build step, no dependencies, no secret keys in the site.

## Files

| File | What it is |
|------|------------|
| `index.html` | Page structure (header, hero, store grid, about, footer) |
| `styles.css` | Gumroad/comic styling (flat brights, thick black borders, hard shadows) |
| `script.js` | **Config + the code that loads your products** |
| `assets/` | Static images (your cover, etc.) |

## ⚙️ How it works (auto-updating store)

On every page load, `script.js` fetches your catalog from the **public** endpoint:

```
https://api.pocketsflow.com/creator-pages/products/<username>
```

…and renders a product card for each published ebook. Each card's button opens
that product's secure PocketsFlow checkout:

```
https://<username>.pocketsflow.com/<product-slug>
```

So the flow to add a new ebook is simply: **create & publish it in PocketsFlow → refresh the site.** Done.

> No API key is used anywhere in this site — it only reads your *public* product
> list, exactly like your PocketsFlow storefront does. Nothing here can touch your
> account.

## ✏️ Customize (1 block)

Open **`script.js`** and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  username: "morsar",          // 👈 your PocketsFlow username/subdomain — drives everything
  brandName: "Morsar",
  headline: "No-fluff guides for people who build.",
  tagline:  "Practical, step-by-step playbooks…",
  social: { twitter: "", instagram: "", youtube: "", website: "" }, // footer links
};
```

That's it. Product titles, prices, covers, and checkout links all come from
PocketsFlow automatically.

## 🎨 Change the look

Colors live at the top of `styles.css` (the `:root` block) — swap `--pink`,
`--yellow`, `--cyan`, `--paper`, etc. to re-skin the whole store. The thick
borders + hard shadows are controlled by `--border` and `--shadow`.

## Product display notes

- **Covers**: shown in a portrait (3:4) frame. Upload covers in PocketsFlow for the best look; products without a cover get a styled title block.
- **Prices**: regular price shows as `$19.99`; pay-what-you-want shows `$9+`; free products show `Free`.

## 🚀 Run locally

```bash
cd myEbook
python3 -m http.server 5173
# open http://localhost:5173
```

## 🌐 Deploy (free)

It's fully static — drag the folder into **Netlify**, **Vercel**, or
**Cloudflare Pages**, or push to **GitHub Pages**. PocketsFlow handles all
payments and delivery.
