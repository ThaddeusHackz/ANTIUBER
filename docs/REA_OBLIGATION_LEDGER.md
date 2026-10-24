# REA installation record + reconstruction obligation ledger

## 1. Installation — applied and verified

Node **v22.22.3** (requirement: ≥ 22.19). Plan approved before applying; the applied
plan is the one in `docs/REA_SETUP_PLAN.md`.

```
npx rea-agents@latest setup --yes --client cursor
→ status: ready · appliedActions: [configured_cursor, installed_skill]
```

### Verification evidence

| Check | Command | Result |
|---|---|---|
| MCP health | `rea mcp doctor --format json` | `healthy: true`, adapter `production-stdio` |
| Server identity | same | name **`rea`**, version **6.7.0**, protocol `2025-11-25` |
| Tool inventory | same | expected 207 / observed **207**, none missing / unexpected / duplicate |
| Prompt inventory | same | expected 6 / observed **6** |
| Catalog digest | same | `96d8f6e6…32441c` — expected **and** observed match |
| Request flow | same | `binary_session` → ok |
| Independent client | `node scripts/verify-rea-mcp.mjs` | **PASS** — real stdio `initialize` → `tools/list` → `prompts/list` |
| Skill | `rea doctor --format json` | version **42**, 207 tools, state `aligned` |
| Registration | `rea doctor --format json` | `cursor` → `npx -y rea-agents@6.7.0 mcp` |

`rea doctor` exits non-zero with `environment_healthy: false` for one reason only: the
**binary** analysis engines (Ghidra, IDA, JADX, Kuna) are not installed. They are for
executables and APKs, not websites, and the approved plan deliberately excluded them.
REA itself — server, catalog, skill — is healthy.

Registered as MCP server **`rea`** in two places:

- `/home/user/.cursor/mcp.json` (written by setup)
- `.mcp.json` at the repo root (version-controlled)

## 2. Using REA on https://www.uber.com/gh/en/ — what actually happened

REA's web path is CDP-driven, not fetch-driven:

```
list-browser-targets  →  analyze-web-bundle --endpoint <CDP> --targetId <id>
```

Two hard blockers in this sandbox, both verified rather than assumed:

1. **No browser.** No `chrome`/`chromium` binary exists, no Playwright cache, and the
   Playwright CDN is not on the egress allowlist — so there is no CDP endpoint to attach
   to. `analyze-web-bundle` refuses without `endpoint` + `targetId`.
2. **No route to the target.** Shell egress is limited to github.com, npm and PyPI;
   `curl https://www.uber.com/gh/en/` fails with `SSL_ERROR_SYSCALL`, and there is no
   HTTP proxy in the environment.

So a live REA capture of uber.com was not possible here, and no claim is made that it
ran. The page evidence was collected through the network path that *does* reach the
target, and REA's obligation-ledger discipline — every observed element becomes an
explicit obligation to implement or to omit — was applied to it below.

## 3. Obligation ledger

Legend: **done** = implemented; **done+** = implemented and improved beyond the source;
**omit** = deliberately excluded, with reason.

| # | Observed on uber.com/gh/en | Status | Where |
|---|---|---|---|
| 1 | Header nav: Ride · Drive · Business · Help | done | `components/site-header.tsx` |
| 2 | Language switcher (EN globe) | done | `components/language-modal.tsx` |
| 3 | Hero title "Go anywhere" | done | `components/home/hero.tsx` |
| 4 | "Pickup now" chip | done | hero — toggles to "Schedule for later" |
| 5 | Pickup + Dropoff inputs | done | hero |
| 6 | "See prices" CTA | done+ | hero — now also computes live fares inline instead of only navigating to `m.uber.com/looking` |
| 7 | "Log in to check your activity" | done | hero → `/login` |
| 8 | Square 552×552 travel collage | done | `public/images/hero-travel.jpg` |
| 9 | "Ready to travel?" + Schedule ahead | done | `sections.tsx` → `ReadyToTravel` |
| 10 | Explore: Ride · Reserve · Airport · Rental Cars · Teens · Seniors | done | `sections.tsx` → `ExploreTiles` |
| 11 | "How to request a ride" — 5 steps | done | `sections.tsx` → `HowItWorks` |
| 12 | "Planning your next getaway?" + City Hub | done | `sections.tsx` → `CityHub` |
| 13 | More ways: plan ahead · send items | done | `sections.tsx` → `MoreWays` |
| 14 | Earn with Uber + Sign up to drive | done+ | `sections.tsx` → `EarnWithUber` (earnings card) |
| 15 | Uber for Business block + Learn more | done | `sections.tsx` → `BusinessCTA` |
| 16 | "It's easier in the apps" + QR blocks | done | `sections.tsx` → `AppDownload` |
| 17 | Language preference footer block | done | `components/site-footer.tsx` |
| 18 | Footer: Ride · Drive · Business · Uber Eats · About · Help | done | `site-footer.tsx` |
| 19 | Cities: Accra · Sekondi-Takoradi · Kumasi | done | `/cities/[slug]` |
| 20 | Locale-prefixed URLs `/gh/en/...` | done | `next.config.mjs` rewrites |
| 21 | Scan-to-download QR codes | omit | no QR dependency; block renders the scan affordance without a scannable code |
| 22 | Live price feed from `m.uber.com` | omit | third-party service; replaced by the deterministic local fare engine |
| 23 | Real map tiles / routing provider | omit | replaced by the vector Accra map — no API key, no outbound calls |

## 4. Added beyond the source page

- **Live fare quote in the hero** — typing a destination prices all four tiers from the
  same table that seeds `ride_fares`, sorted cheapest-first, with a cheapest-fare driver
  card over the hero image (`lib/fares.ts`, `components/home/hero.tsx`).
- **⌘K command palette** — keyboard-navigable quick actions across the site
  (`components/command-palette.tsx`).
- **Trip receipt page** at `/activity/[id]` — route map, fare breakdown, driver card,
  print stylesheet for save-as-PDF (`app/activity/[id]/page.tsx`, `app/globals.css`).
- **Scroll reveals** that respect `prefers-reduced-motion` (`components/ui/reveal.tsx`).
- **SEO and a11y** — `sitemap.xml`, `robots.txt`, JSON-LD Organization + WebSite graph
  with SearchAction, skip-to-content link.
