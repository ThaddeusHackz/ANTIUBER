# REA Install + MCP Registration — Setup Plan (for approval)

Generated from a **dry run only**. Nothing has been applied yet.

---

## 0. Environment check

| Check | Result | Verdict |
|---|---|---|
| Node.js | **v22.22.3** | ✅ satisfies REA `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` |
| npm / npx | 10.9.8 / 10.9.8 | ✅ |
| Platform | linux x64 | ✅ |
| Free disk | 20 GB | ✅ (package is 28.6 MB unpacked) |
| Existing MCP config | none found (`~/.cursor/mcp.json`, `~/.claude.json`, project `.mcp.json` all absent) | clean install |
| Repo state | `ThaddeusHackz/ANTIUBER` @ `5b45dd3`, branch `arena/dc980fd3-antiuber`, only a README | ✅ |

## 1. Package identity

| Field | Value |
|---|---|
| Package | `rea-agents` |
| Latest version | **6.7.0** (published 2026-10-18) |
| License | MIT |
| Homepage | https://github.com/morluto/rea |
| MCP name | `io.github.morluto/rea` |
| Distribution | 1,775 files, 28,575,703 B unpacked |
| Supply chain | npm **SLSA provenance attestation** present + registry signatures |
| Capability surface | 153 CLI commands · **207 MCP tools** · 6 MCP prompts |

Install method: `npx rea-agents@latest` (no global install required; run on demand, pinned to `6.7.0` in the MCP registration for reproducibility).

## 2. Exact actions from `npx rea-agents@latest setup --dry-run --client cursor`

The bare command planned **zero actions** because this sandbox has no supported MCP host installed (no Claude Code, Cursor, VS Code, Codex, Gemini CLI…). Re-running with an explicit client resolves the real plan:

```
status: planned
plannedActions:
  - id: configure_client:cursor
    kind: configure_client
    label: Cursor
    target: /home/user/.cursor/mcp.json
    operation: create
    detail: Add the REA MCP registration for Cursor; preserve unrelated
      configuration. Command: "npx" "-y" "rea-agents@6.7.0" "mcp".
      No additional provider environment variables.
      Existing server environment overrides are retained.

  - id: install_skill
    kind: install_skill
    label: REA reverse-engineering skill
    target: /home/user/.agents/skills/reverse-engineer-anything
    operation: install
    detail: Install or update the bundled REA reverse-engineering skill and
      on-demand references.
```

### What approval will apply

1. **Register the MCP server** in `/home/user/.cursor/mcp.json` (host-native config), keyed **`rea`**, transport **stdio**, command `npx -y rea-agents@6.7.0 mcp`.
2. **Register the same server, name `rea`, in the project-level `.mcp.json`** at the repo root so any MCP-capable client opened on this repo discovers it. (Added deliberately, because no MCP host binary exists in this container.)
3. **Install the bundled skill** to `~/.agents/skills/reverse-engineer-anything`.
4. **No provider setup**: no Hopper download (`--install-hopper` NOT used), no Ghidra/IDA Pro/JADX/Kuna configuration, no environment variables, no system packages.
5. **No** writes outside `~/.cursor/`, `~/.agents/skills/`, and the repo's `.mcp.json`.

### Explicitly out of scope

- No binary/APK/firmware analysis engines are installed. Those are optional providers and are not needed for the web work requested.
- Nothing is added to the repo's `package.json` (REA runs via `npx`).

## 3. Post-install verification

1. `npx rea-agents@6.7.0 mcp doctor` — validates server startup + tool listing.
2. **Live JSON-RPC handshake** over stdio: `initialize` → `tools/list` → assert the server reports 207 tools and `serverInfo.name`.
3. `npx rea-agents@latest doctor --format json` — health snapshot (`cli_package_version`, skill state, registrations).
4. Validate both config files parse and contain `mcpServers.rea`.

## 4. Rollback

```
npx rea-agents@latest uninstall          # removes REA-owned registrations + skill
rm -f .mcp.json                          # removes the project registration
```

## 5. Then — reverse-engineer `https://www.uber.com/gh/en/` and rebuild it

### Recon phase

- **`fetch_page`** against `https://www.uber.com/gh/en/` for the real section order, headings, nav, CTA labels, ride-form fields, footer taxonomy and asset URLs.
- **`web_search` / `image_search`** for the live visual reference (layout rhythm, hero composition, card grid, mobile breakpoints).
- **REA static analysis** where it works locally: bundle/page-structure walkthroughs on saved captures, `analyze-web-bundle`, `inspect-web-page`, and the captured-asset inventory.

> ⚠️ Sandbox egress is allowlisted to npm/PyPI/GitHub. REA's own headless-browser capture cannot open `uber.com` from bash; my browsing tools can. That limit is documented rather than hidden, and REA's static/web analysis is still used on the downloaded bundle and the built app.

### Build phase

- **Next.js (App Router) + React + TypeScript + Tailwind**, route-for-route parity:
  - `/` marketing home (header + mega menu, city picker modal, hero ride form with pickup/dropoff/time, "See prices", explore tiles, how-to-request steps, City Hub, more ways, earn, business, app downloads, full footer)
  - `/gh/en/` locale-prefixed route matching the Ghana URL
  - Logged-in shell: `/login`, `/signup`, `/ride`, `/activity`, `/account`, `/payments`, `/help`, `/schedule`
- **Logged-in re-creation**: rider home with saved places + map panel, ride request → fare estimate → tier selection → matching → trip → receipt/rating, activity history, account/payment settings.
- **State + data**: Supabase (auth + `rides`, `places`, `payment_methods`, `fares` with RLS), falling back to a local seeded store so the site always runs without secrets.
- **Connectors used where they genuinely work**: Supabase (DB/auth), Vercel (deploy), Google Sheets (fare/ride-option source of truth), Notion (help-centre articles), Drive/Dropbox (image assets). Each is wired only after confirming its live capability; nothing is faked.
- **Live preview** on `0.0.0.0` so the site is viewable in the browser panel.

### Asset / brand note

The build reproduces **layout, spacing, type scale, colour, components and interactions** as closely as the public page allows. Uber's logo, wordmark, trademarked icons and proprietary photography are **not** copied — the clone uses original generated imagery and a distinct wordmark, and marketing copy is rewritten while keeping the same structure and tone. It is a reverse-engineered demo, not an official Uber product.
