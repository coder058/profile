# Jordi Lluis — portfolio

A small portfolio of interactive systems and the questions behind them.

Canonical portfolio: https://coder058.github.io/profile/

## Selected work

- **Polybow** — a live prediction-market system and evidence-led postmortem: development history, scoped API-response timings, wallet reconciliation and the full negative outcome. Not proof of a profitable strategy.
- **Relay** — a job-research workspace built around four read-only MCP tools. Search public listings, compare quoted text and export a review.
- **Pattern Forge** — closed-candle Hyperliquid snapshots and prefix-only replay of recorded metals, index and crypto perpetual markets. The public page does not execute trades or predict returns.
- **DispatchOps** — a synthetic dispatch simulator for assigning work, handling incidents and reviewing an explainable recommendation before it changes the shift.

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
