# Celina Bites — website

Cinematic one-page site + full online menu for **Celina Bites** (مناقيش · كرواسون · بيتزا · معجنات).
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

The site is plain static files (no Node server needed).

- Every push to `main` runs `.github/workflows/deploy.yml`: it builds the site and publishes the ready files to the
  **`deploy`** branch (and as a downloadable **celina-bites-website** artifact in the Actions tab).
- hPanel → **Websites → celinabites.com → Advanced → Git** → repository `beirutbitesofficial-crypto/Celinabites`,
  branch **`deploy`**, install path empty (= `public_html`). Turn on auto-deployment so every push goes live.
- Or by hand: download the artifact and upload its contents to `public_html` (replace the old `index.html`).

## Motion & accessibility

- Every GSAP setup runs inside `useGSAP` + `gsap.matchMedia()` and is reverted on unmount / breakpoint / language change.
- `prefers-reduced-motion` → nothing pinned or scrubbed; the oven scene shows its finished state.
- Letter-spacing is switched off for Arabic text (it breaks the joined letters).
