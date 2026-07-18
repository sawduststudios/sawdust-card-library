# PRODUCTION PLAN — Sons of Sawdust web

Product in one sentence: you caught a few cards at our concert — come see the whole
collection, find out how rare yours is, hunt trades, and sing along.

Rules of this plan:
- Layers are built **strictly in order**. A layer is done when it is deployed,
  works at mobile width, and is committed. Only then does the next layer start.
- When time runs out, we ship whatever layer is complete. Every layer leaves the
  site in a shippable state.
- 🛑 markers are hard stops. Do not cross them "because it's going well."

---

## Layer 0 — The Shrine Opens (shell) · ~1.5–2 h
Repo scaffold (Vite + React), routing, GitHub Actions deploy, live Pages URL.
Landing page: short intro to the band/faith, two big doors — **Kartotéka** (card
library) and **Texty** (lyrics). Persistent minimal nav so Library ↔ Lyrics never
goes through home. Placeholder content behind both doors. All copy Czech.
**Done when:** the public URL works on a phone, three pages exist, nav works.
⚠️ Decision gate before first push: everyone in the card photos (incl. parents of
kids) has OK'd being on the public internet.

## Layer 1 — Texty (lyrics) · ~45–60 min
`data/songs.json` → song list page → song page (title, lyrics, optional image).
**Done when:** placeholder song renders correctly (stanzas, line breaks) and adding
a song = adding one JSON entry, nothing else.

## Layer 2 — Kartotéka, basic grid · ~1–1.5 h
Grid of all cards (thumbnail, name, rarity badge). Tap → detail view: full image +
all data. Null fields hidden; printCount rendered as "Vytištěno pouze N kusů" when
present. Detail view has its own URL (shareable link = the trading mechanic).
**Done when:** all 5 seed cards browsable end-to-end on a phone.

## Layer 3 — Library tools · ~1.5–2 h
Filter chips (class, rarity), diacritic-insensitive search, sort (every stat,
powerLevel, releaseDate), live result count ("14 karet"). All state in URL params.
**Done when:** Goth Girls findable in two taps; a shared filtered link reproduces
the exact view on another phone.

🛑 **DAY ONE GUARANTEE LINE.** Layers 0–3 are the day-one commitment and a complete,
launchable v1. If ahead of schedule, continue below — but never start Layer 4 with
Layers 0–3 undeployed or shaky. If behind, cut from the top down (4 before 5? No —
see order below) and ship.

## Layer 4 — Binder navigation · ~1 h (first thing cut if the day runs long)
Swipe (mobile) + arrows & keyboard (desktop) in detail view. Navigates the
**currently filtered + sorted list** (inherited from URL state). Direct link with
no filter context → full collection, default order. No wrap-around at list ends.
**Done when:** filter to heretics, swipe through exactly the heretics, stop at the end.

## Layer 5 — Flavor pass · ~1–1.5 h
Random card button ("Vyvolej kartu z pilin") — enables phone-vs-phone play.
FAQ page in the library menu ("Jak získám karty?", "Jak se to hraje?"). Joke 404.
Theming polish per CLAUDE.md style rules; "Powered by FAITH" footer.
⚠️ Decision gate: review the theme on the dev server together before deploying it.

🛑 **END OF DAY ONE, absolute.** Nothing below gets touched on day one.

## Layer 6 — Housekeeping · ~30–45 min (whenever, pre-batch-two)
`scripts/optimize-images` (sharp → webp thumbs); grid uses thumbs, detail uses
originals. Current 5 images are small (100–160 KB) so this waits until the
collection grows.

---

## Human content track (parallel, no code — can happen any time)
- Proofread the 5 seeded entries in `data/cards.json` against physical cards.
- Replace placeholder in `data/songs.json` with real songs (band writes these).
- Decide printCount / releaseDate per card, or leave null.
- Write FAQ answers and landing-page copy (Czech, in-universe).
- Collect brand assets (posters, "Powered by FAITH" art) into a `brand/` folder
  as theming reference for Layer 5.

## Backlog (parked; schema is already ready where relevant)
Synergy links UI (field ships now, empty) · library stats page · setlists via song
tags · NEW badges + newest-first once batch 2 exists · rich link previews (per-card
OG pages, ~half day) · blog (cheap code, expensive content commitment — wait until
there's a second announcement) · collection tracker (localStorage = per-device,
wipeable; wrong feeling for collecting) · QR codes on printed cards (zero code,
Canva-side) · print sheets · deck theorycrafter.

## Cut (decided, not sleeping)
Duel mode (humans + random button already are the rules engine) · native share
button (copy link suffices).

## Decisions ledger (locked)
Czech UI, hardcoded · static site forever, no accounts · nulls are first-class in
card data · detail navigation follows the active filtered list, no wrap · site
voice is always the faithful side · Johnny English, not James Bond.
