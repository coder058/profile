# Jordi Lluis — Python & data software

[Portfolio](https://coder058.github.io/profile/) · [Résumé](https://coder058.github.io/profile/resume.html)

Independent engineering projects and open-source work, with a background in logistics operations and applied finance. The website does not claim employed software seniority.

## Featured evidence

- Polybow: independently operated Python execution and recording, then reconciliation and a public postmortem. Private bot code and raw recordings are not published. No durable-profitability claim.
- New, separate reconciliation lab: generated Python output on synthetic fixtures, atomic PostgreSQL imports and a local read-only FastAPI API. The homepage opens the lab; the historical recording schema remains one click away. Database recovery is checked in the linked CI run, not performed by the static page.
- Pattern Forge: interactive replay without look-ahead. Python/PostgreSQL ingestion and restart checks run locally/in CI; the public demo does not serve that database.
- Info Desk: a recorded evidence case. The live research workspace requires local setup; evaluation limitations are linked.
- Haystack: a focused merged validation fix, with regression test and maintainer review.

Relay remains available as a repository walkthrough, labelled as having an unavailable public backend. Training work is separate. No projects or deployments were deleted.

## Build and verify

No package installation is required for the static site.

```sh
node scripts/build-project-guides.mjs
node --test tests/*.test.mjs
python -m http.server 8765 --bind 127.0.0.1
```

Edit project guides through projects/content.mjs. The résumé HTML, PDFs and public manifest are generated from the private workspace's canonical profile; never publish its internal application instructions. The public manifest exposes only the backend and market-data packs, public contact information and checksums.

## Publication and privacy

GitHub Pages serves gh-pages. Review text, PDF renders, links and tests before publishing. Do not add credentials, private trading logs, wallet identifiers, prepared application answers or local filesystem paths to this repository.
