# REA setup plan — approval required

Generated from `npx rea-agents@latest setup --dry-run --client cursor` on branch
`arena/acbf590c-antiuber`. **Nothing below has been applied yet.**

## 1. Preflight (verified)

| Check | Result |
|---|---|
| Node.js | **v22.22.3** — satisfies ≥ 22.19 |
| npm | 10.9.8 |
| Package | `rea-agents@6.7.0` (MIT, SLSA provenance, resolves from registry.npmjs.org) |
| Bare `setup --dry-run` | **0 actions** — no agent client is detected in this fresh sandbox |
| `setup --dry-run --all-detected` | 1 action — skill only (still no client detected) |
| `setup --dry-run --client cursor` | **2 actions** — the plan below |

The bare command the brief asks for plans nothing on its own; a client has to be named.
That is why the plan below passes `--client cursor` explicitly.

## 2. The resolved plan — 2 actions, both user-scoped, both local

### Action 1 — `configure_client:cursor`

| | |
|---|---|
| Target | `/home/user/.cursor/mcp.json` (currently absent) |
| Operation | create |
| Registered name | **`rea`** |
| Command | `npx -y rea-agents@6.7.0 mcp` |
| Environment | none — no provider variables added |
| Behaviour | preserves unrelated config if the file appears before execution; existing
server env overrides retained; a backup path is recorded for the pre-existing contents |

### Action 2 — `install_skill`

| | |
|---|---|
| Target | `/home/user/.agents/skills/reverse-engineer-anything` |
| Operation | install / update |
| Contents | the bundled REA reverse-engineering skill plus its on-demand references |

### Repo-level registration (already committed, no change needed)

`.mcp.json` at the repo root already declares the same server, so the project carries its
own `rea` registration:

```json
{ "mcpServers": { "rea": { "command": "npx", "args": ["-y", "rea-agents@6.7.0", "mcp"], "env": {} } } }
```

## 3. Explicitly NOT part of this plan

- **No analysis-provider installs.** Ghidra, IDA, JADX and Kuna are all unconfigured, and
  they stay that way. They are binary/mobile reverse-engineering engines — irrelevant to
  a website, and `setup` does not download them.
- **No Hopper.** `--install-hopper` is not passed (macOS-only anyway).
- **No network writes to third parties**, no telemetry, no account actions.
- **Nothing written outside `/home/user`.** Two paths total, listed above.
- **No model or credential configuration.** REA runs locally over stdio.

## 4. Verification that will follow the apply

Four independent checks — the install is not assumed to have worked:

1. `rea doctor --json` — overall alignment.
2. `rea mcp doctor --json` — registration health, package digest, protocol version.
3. `node scripts/verify-rea-mcp.mjs` — an **independent** MCP client that spawns the
   server and performs the real stdio handshake: `initialize` → `tools/list` →
   `prompts/list`, asserting the server name, tool count and protocol version.
4. Read back both config files and diff the registered command against the plan.

## 5. Then: REA applied to https://www.uber.com/gh/en/

The intended REA run is its web-bundle path:

```bash
rea analyze-web-bundle https://www.uber.com/gh/en/ --format md
rea build-reconstruction-obligation-ledger --format md
```

**Known constraint, stated up front:** this sandbox's shell egress only reaches
github.com, codeload.github.com, api.github.com, registry.npmjs.org, pypi.org and
files.pythonhosted.org. `curl https://www.uber.com/gh/en/` fails with
`SSL_ERROR_SYSCALL`, there is no HTTP proxy in the environment, and REA's capture tools
run in this same shell — so a live capture of uber.com from the CLI is expected to fail.
It will be attempted once after install and the failure recorded honestly.

The analysis will therefore be driven through the network path that *does* reach the
target (the page-fetch connector), with REA's methodology and obligation-ledger format
applied to that evidence: an exhaustive inventory of every section, heading, CTA, link
target, image and app-store block on the live page, each one tracked as an obligation to
either implement deliberately or omit deliberately. Previously captured evidence for the
page is already on file in this session.

## 6. What "better and more impressive" will mean

Beyond parity with the current build:

- A logged-in rider experience with working state transitions rather than static screens.
- Motion and interaction polish, real map treatment, skeleton/empty/error states.
- Accessibility and responsive behaviour treated as acceptance criteria.
- The REA obligation ledger checked in as proof of coverage, section by section.

## 7. Rollback

Delete the two paths in §2. The repo `.mcp.json` is version-controlled and unaffected.
