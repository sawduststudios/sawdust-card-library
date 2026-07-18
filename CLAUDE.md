# CLAUDE.md — Sons of Sawdust: Sawdust Card Library & Holy Texts

## What this is
The official fan site of **Sons of Sawdust**, a Czech band that is (in-universe) a
holy order worshipping the God of Sawdust. Physical trading cards are handed out as
merch at concerts. The site lets fans browse the full card collection, check how
rare their cards are, share cards for trading, and read song lyrics — often mid-concert.

Build order and scope live in `PRODUCTION_PLAN.md`. Follow its layers strictly, in
order, one layer at a time. Never start a layer before the previous one is done and
committed.

## Hard constraints
- 100% static site. No backend, database, auth, accounts, cookies, or analytics.
- Hosting: GitHub Pages, deployed via GitHub Actions on push to `main`.
- Free tier everything. Stack: Vite + React, plain npm. No new dependencies without asking.
- Mobile-first (fan at a concert, one hand, bad venue wifi); must also work on desktop.
- **All UI copy is in Czech**, hardcoded. Czenglish and mixing Czech with English is
  part of the brand and very common ("Holy Texts" instead of "Posvátné Texty").
  No i18n framework. Card/song data stays exactly as printed — often mixed
  Czech/English, occasionally other languages (one card's flavor is a French meme).
  Never "fix" or translate content.

## Git workflow (important)
The human handles ALL git operations via GitHub Desktop. Claude must never run
`git add`, `git commit`, `git push`, or any state-changing git command (read-only
commands like `git status`/`git log` are fine). Instead, at every natural
checkpoint, pause and tell the human: "good moment to commit — suggested message: …".

## Data model
Single source of truth: `data/cards.json` and `data/songs.json`. Adding content
must always mean: drop an image in `images/`, add one JSON entry, push.

Card fields:
- `id` — must exactly equal the image filename without extension. In practice
  filenames mix kebab-case and snake_case (`hobopremek`, `maty_of_fortune`); exact
  match beats aesthetics. Never rename images to "clean them up".
- `name` — as printed on the card.
- `rarity` — currently common|rare|legendary. The list will grow; always derive the
  set of rarities (for filters etc.) from the data, never hardcode.
- `class` — currently plebian|sawdust-fan|sawdust-priest|eldritch|heretic|fairy|artifact
  (spelling as printed). Same rule: derive from data, never hardcode; new classes
  must appear in filters automatically.
- `powerLevel` — int, OR a literal display string (one card has "?").
- `stats` — {attack, defense, hp, range, faith}. Each value is a number (ints;
  faith is a percent 0–100 and MAY be a float, e.g. 74.99) OR a literal display
  string shown verbatim: "?" = unknown (e.g. Shapeshifter, all stats "?"),
  "-" = not applicable (e.g. an artifact with no faith). Future cards may invent
  new weirdness — render unknown strings verbatim, never crash.
  Sorting/filtering: non-numeric values are excluded from numeric comparisons and
  sort last.
- `flavor` (string|null, may contain `\n`), `rules` (verbatim from card, mostly
  Czech), `image`, `releaseDate` (ISO string|null), `printCount` (int|null),
  `lore` (string|null), `synergies` (array of card ids, may be empty).

**Nulls are first-class:** UI silently hides missing fields. A card with nothing but
name/stats/image must look complete, and a card with printCount 10 should make its
owner feel special ("Vytištěno pouze 10 kusů").

Song: `id`, `title`, `lyrics` (plain text, `\n` line breaks, blank line = stanza),
`image` (path|null), `tags` (array, empty for now — reserved for future setlists).

## Style & voice (the brand, distilled — this section is law)
- **North star: Johnny English, not James Bond.** Earnestly trying to be grand and
  holy, visibly held together with tape, and it actually works. If a design choice
  feels slick and professional, it's off-brand; if it feels broken or unusable, it
  went too far. Charmingly cheap, never actually bad UX.
- **Two registers.** (1) Landing page and small touches: DIY shitpost-holy — MS-Paint
  energy, cardboard-sign typography, "Powered by FAITH", a faint televangelist wink.
  (2) Library and lyrics: calm, readable, database-like — a homage to collectible
  card games. The cards are the stars; the UI serves them and stays out of the way.
  It is still in the brand/band style.
- **The site's voice is always the faithful side.** The site is an official,
  church-certified artifact of the Sawdust faith. Heretic cards exist as catalogued
  data (like villain cards in any CCG), but the site itself never speaks as a heretic.
- **In-universe Czech copy everywhere**, including buttons (e.g. random card =
  "Vyvolej kartu z pilin"), 404, FAQ. Flavor must never obscure function: a first-time
  visitor must always instantly understand what a button does.
- Typography: expressive and fun on the landing page; quiet and readable in the
  library and lyrics. Body text is never a novelty font.
- Never looks like: a corporate dashboard, a generic template, a neon "epic gamer"
  site, or genuinely polished professional work.

## Gotchas
- GitHub Pages project sites serve from `/<repo-name>/` — read the repo name from
  the git remote and set Vite `base` accordingly, or all assets 404 in production
  while working locally.
- Search must be diacritic-insensitive ("obetovani" matches "obětováním").
- Grid uses optimized thumbnails once the image script exists; full image only in
  detail view. Never ship multi-MB originals to the grid.
- Card visual layouts differ by rarity. Never reconstruct card layout in HTML —
  always show the image; JSON data drives filtering/sorting/search and the detail panel.
- Detail view prev/next/swipe navigates the *currently filtered+sorted list* (state
  is in the URL). Direct link with no filter context = full collection, default
  order. At list ends, stop — do not wrap around.

## Conventions
- Filter/sort/selected-card state lives in URL query params; every view is a shareable link.
- Work in small steps; at the end of each working step and each layer, prompt the
  human to commit (see Git workflow).
- Small boring components, React hooks only, no state libraries.
- Scripts go in `scripts/`, documented in README.
- Keep this file and the Commands section current when decisions change.

## Commands
(Fill in at Layer 0 and keep current.)
- `npm run dev` / `npm run build` / `npm run preview`

## Definition of done, always
Builds cleanly, works at mobile width, UI copy in Czech, the human has committed,
verified on the deployed GitHub Pages URL.