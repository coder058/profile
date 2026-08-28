# Jordi Lluis — portfolio

Software Engineer | AI Products & Data Systems.

## Selected work

- **Relay** — a public job-evidence workspace and real read-only MCP server. Search public listings, compare quoted text, retain changed duplicates and export a review. Historical fixture-based safety tools remain separate.
- **Video AI Digest** — browser-local transcript/subtitle search, timestamped excerpts, user notes and portable exports. Media transcription and optional model processing belong to the separate local Node/Python app, not the hosted page.
- **Hyperliquid / Pattern Forge** — public closed-candle snapshots for BTC, ETH and SOL with research overlays, source timestamps, JSON export and a separate saved BTC case. The public page does not poll localhost or execute trades.
- **Polybow Forensics** — anonymized, reproducible postmortem of 1,137 live prediction markets. Full drawdown is part of the case; no profitability claim is made.

The 2026-08-28 project audit removed VÆRN and Atelier Z from the featured selection because their hosted storefronts do not demonstrate the depth of the underlying systems. Their projects and existing deployments were not deleted. Course exercises remain outside the featured portfolio.

The interaction system uses scroll-linked palette changes, progressive reveals and reduced-motion fallbacks. It takes inspiration from archival editorial websites without copying their branding or assets.

## Run locally

No build step or package installation is required. Open `index.html` directly, or serve the directory locally:

```bash
python -m http.server 8765
```

Then visit <http://127.0.0.1:8765/>.

## Deployment

The repository is configured around the `gh-pages` branch and can be published with GitHub Pages after the content, résumé and links receive a final review. Publication is intentionally separate from local development.

## Assets and privacy

The portrait and résumé in `assets/` are personal data intended for the public portfolio. Review them before publishing. Do not add secrets, private trading data, API keys or wallet information to this repository.
