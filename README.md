# Jordi Lluis — portfolio

A small portfolio of interactive systems and the questions behind them.

Canonical portfolio: https://coder058.github.io/profile/

## Selected work

- **Python trading bot** — a live prediction-market system and evidence-led postmortem: development history, scoped API-response timings, wallet reconciliation and the full negative outcome. Not proof of a profitable strategy.
- **Relay** — four read-only MCP tools and a React UI share one matcher. Paste a listing; each hit is a quote, not a hiring score. Arbeitnow is a demo snapshot.
- **Pattern Forge** — replay without look-ahead; CI runs tests, Docker and a PostgreSQL restart. The public demo does not serve that database.

Each selected card opens a project walkthrough with the problem, contribution, usage steps, dependency table and limitations. [More challenges](https://coder058.github.io/profile/#more-challenges) lists the other public GitHub work: seven API labs and the Rails exercises, including Wikinimous. I do not claim every Le Wagon Kitt challenge.

[Résumé](https://coder058.github.io/profile/resume.html) — the curated one-page PDF. GitHub is for code, not a second résumé.

The 2026-08-28 project audit removed VÆRN and Atelier Z from the featured selection because their hosted storefronts do not demonstrate the depth of the underlying systems. Their projects and existing deployments were not deleted. Course exercises remain outside the featured portfolio.

The interaction system uses scroll-linked palette changes, progressive reveals and reduced-motion fallbacks. It takes inspiration from archival editorial websites without copying their branding or assets.

## Run locally

No package installation is required. The committed HTML works directly. After editing `projects/content.mjs`, regenerate and check the guides:

```bash
node scripts/build-project-guides.mjs
node --test tests/*.test.mjs
```

Serve the directory locally:

```bash
python -m http.server 8765
```

Then visit <http://127.0.0.1:8765/>.

## Deployment

The repository is configured around the `gh-pages` branch and can be published with GitHub Pages after the content, résumé and links receive a final review. Publication is intentionally separate from local development.

## Assets and privacy

The portrait and résumé in `assets/` are personal data intended for the public portfolio. Review them before publishing. Do not add secrets, private trading data, API keys or wallet information to this repository.
