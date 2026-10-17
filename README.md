# Celina Pastry — website

Cinematic one-page site + full online menu for **Celina Pastry** (مناقيش · كرواسون · بيتزا · معجنات).
Next.js (App Router) · React · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger. Same stack and style as Sushi Bento / BASST CUT / 24i.
Arabic (right-to-left) by default, with an English switch — the choice is remembered on the device.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Before going live — check these in `lib/site.ts`

| Field | What |
| --- | --- |
| `whatsapp` | Number that receives orders, digits only with country code (`96181626267`). |
| `phones` | Shown as "Call" buttons. |
| `directionsUrl`, `mapEmbed` | ⚠️ Still a search for "Celina Bites" — replace with the shop's own Google Maps link / address. |
| `hours` | Opening hours (Beirut time). Today 7 am – 11 pm every day. Drives the live "Open now" badge. |

## Structure

| File | What it does |
| --- | --- |
| `components/Hero.tsx` | Intro: the logo assembles (dough → zaatar → a bite is taken), letter reveals, embers, parallax |
| `components/OvenScene.tsx` | Pinned, scroll-scrubbed scene: dough ball → pressed open → zaatar & oil → into the oven → golden → wrapped with the Celina stamp. Timeline map at the top of the file. Scrolling back reverses it exactly. |
| `components/Story.tsx` | Scrubbed word reveal + numbers |
| `components/Favourites.tsx` | Desktop: pinned horizontal track (runs the right way in Arabic). Mobile: swipe carousel |
| `components/Menu.tsx` | Full menu — sticky category bar, search (Arabic + English), sizes/styles with their prices |
| `components/Cart.tsx` | Floating cart + drawer → order sent as a pre-filled WhatsApp message (Arabic + English) |
| `components/Visit.tsx` | Hours, live open/closed status, map, phones, Instagram, catering e-mail |
| `components/Bakes.tsx` | Hand-drawn SVG illustrations of every bake (no product photos yet) |
| `lib/menu.ts` | **The menu** — every item and price, in Arabic and English. Edit here. |
| `lib/i18n.tsx` | Every other text on the site, in Arabic and English |
| `lib/site.ts` | Contact details, WhatsApp, map, opening hours |

## Deploy on Hostinger

Hostinger's servers can't build Next.js, so the site is **built on GitHub** and Hostinger only runs it:

- Every push to `main` runs `.github/workflows/deploy.yml`: it builds the site and publishes a ready-to-run copy
  to the **`deploy`** branch — the static files plus a tiny dependency-free `server.js` (`scripts/deploy-server.js`).

**Node.js web app (Deployment from GitHub):**
1. Repository `Celinabites`, branch **`deploy`** (not `main` — `main` needs a build Hostinger can't do).
2. Framework **Other / Express / Node.js** (not Next.js) · Node 20 or 22.
3. Build command `npm run build` (does nothing) · Start command `npm start` · Entry file `server.js` if asked.

**Or plain hosting:** hPanel → Websites → Advanced → **Git**, same repo, branch `deploy`, path empty (= `public_html`).
Or download the **celina-bites-website** artifact from the Actions tab and upload its contents to `public_html`.

## Motion & accessibility

- Every GSAP setup runs inside `useGSAP` + `gsap.matchMedia()` and is reverted on unmount / breakpoint / language change.
- `prefers-reduced-motion` → nothing pinned or scrubbed; the oven scene shows its finished state.
- Letter-spacing is switched off for Arabic text (it breaks the joined letters).
