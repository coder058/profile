// SOURCE: the linked project repositories, inspected 6 September 2026.
// These are dependency relationships, not claims of production scale or employment.
export const projects = [
  {
    slug: 'pattern-forge', name: 'Pattern Forge', stack: 'React · TypeScript · Next.js · WebSockets',
    summary: 'Replay without look-ahead: later candles stay out of the indicators. CI runs tests, Docker and a PostgreSQL restart. The public demo does not serve that database.',
    problem: 'When reviewing a market, it is easy to let later prices influence an earlier decision. I wanted to inspect what an indicator could actually have shown at a chosen point in time.',
    contribution: 'I built the market controls, data validation, replay calculations, candle API and connection handling. TradingView Lightweight Charts renders the chart; I did not build that charting library.',
    demo: 'https://pattern-forge-five.vercel.app/',
    demoLabel: 'Open the demo',
    code: 'https://github.com/coder058/pattern-forge',
    skills: [
      ['React and TypeScript', 'Workspace controls, loading and error states, replay slider and timeframe compare.'],
      ['Next.js candle API', 'Validates markets and closed candles before anything reaches the chart.'],
      ['WebSockets', 'A separate live mid-price with heartbeat and reconnection. Not the replay source.'],
      ['PostgreSQL', 'Local/CI persistence of closed candles and ingest runs. The public demo does not serve that database.'],
      ['Docker and GitHub Actions', 'Image build, tests and a restart check that the stored rows survive.']
    ],
    steps: [
      'Open the workspace. Bitcoin loads by default. The live mid-price changes automatically; the candle chart is a separate snapshot.',
      'Choose a timeframe or select a recorded market such as Gold. Recorded markets are labelled Historical recording.',
      'Move the Replay slider left, then advance a candle at a time. Later candles stay out of indicator calculations.',
      'Choose Compare timeframes to see which complete higher-timeframe candles were available at that point.',
      'Export the selected data prefix. Refresh reloads public candles; it does not turn an archive into a live feed.'
    ],
    dependencies: [
      ['React workspace', 'Candle API and local analysis functions', 'Selection, chart controls and loading/error states.'],
      ['Next.js candle API', 'Fixed Hyperliquid HTTP endpoint', 'Validates supported markets and closed candles; shares concurrent requests and caches successful snapshots in process memory.'],
      ['Live quote connection', 'Hyperliquid public WebSocket', 'A separate mid-price with receipt time, heartbeat and reconnection. No trading account.'],
      ['Recorded replay', 'Bundled OHLC JSON and the replay cursor', 'Only the selected prefix reaches indicators and timeframe aggregation.'],
      ['Chart rendering', 'TradingView Lightweight Charts', 'Candles, overlays and chart interaction.'],
      ['Python ingester (local/CI)', 'Validated public candles or a recorded fixture, psycopg and PostgreSQL', 'Writes closed candles; records each attempt and its fetch/write timing.']
    ],
    recordsTitle: 'How the data was organised',
    recordsIntro: 'Closed candles and ingest runs can be stored in PostgreSQL locally and in CI. The public demo uses recording files and process memory; it does not serve that database.',
    recordsCaption: 'Stored records, keys and responsibility',
    records: [
      ['candles table', 'Primary key (symbol, interval, open_time)', 'Prevents duplicate rows on repeated ingestion; stores OHLCV values and ingestion time.'],
      ['ingest_runs table', 'Each ingestion attempt', 'Stores source, row counts, timing and errors separately from candle data.'],
      ['Stored-candle API (local/CI)', 'PostgreSQL through the pg client and DATABASE_URL', 'Reads saved candles into the existing chart. An empty store returns 404; an unavailable database returns 503.'],
      ['Public demo storage', 'Recording files and temporary process memory', 'No user accounts and no hosted PostgreSQL on Vercel.']
    ],
    build: ['Define a candle format with timestamps and OHLC values.', 'Reject malformed, conflicting and still-forming candles at the boundary.', 'Calculate indicators from the selected prefix, then render the result in React.', 'Keep the streaming mid-price separate from historical calculations.', 'Test malformed inputs, partial upstream failures, replay causality and connection cleanup; build and run the Docker image in CI.'],
    run: 'npm ci\nnpm test\nnpm run build\nnpm start',
    limits: 'The quote timestamp is local receipt time, not an exchange-latency benchmark. Public candles update on Refresh. The oil and other archive datasets are recordings. The repository also includes PostgreSQL persistence for local Docker and CI; the public Vercel demo does not serve that database. The README explains ingestion, duplicate handling and restart checks. This is a read-only analysis tool, not a trading terminal or a profitable strategy.'
  },
  {
    slug: 'info-desk', name: 'Info Desk', stack: 'Python · FastAPI · SQLite · limited tools',
    summary: 'OFAC licenses, the White House oil fact sheet, and AP quotes on one claims table. Demo and evals, not a newsroom in production.',
    problem: 'A model that “summarises the news” can treat an OFAC license list as the same document as a White House fact sheet, pick a ranking, or treat “this page does not name 17 fields” as confirmation. I wanted a desk that compares what each public recording actually says, and refuses to write until a person approves.',
    contribution: 'I stored dated recordings of the OFAC Venezuela page, the 31 August 2026 fact sheet, and AP quotes (not the full article). Python builds a claims table: stated, absent, denied, or attributed. Named extractors keep 65 billion field barrels separate from 46 billion U.S. territorial barrels. lookup_license(99Z) is empty. SQLite inserts a note only when a human approves publish_draft. The six-case harness scores the database.',
    demo: 'https://coder058.github.io/info-desk/',
    demoLabel: 'Open the oil desk',
    code: 'https://github.com/coder058/info-desk',
    skills: [
      ['Python', 'Claims table, named quantities, OFAC license parse, negation so “does not name” is not a claim.'],
      ['Limited tools', 'fetch_source, lookup_license, search_prior_notes. No free-form write.'],
      ['SQLite', 'Drafts stay pending. A note row exists only after a human approves publish_draft.'],
      ['Eval harness', 'Six Inspect-style cases on the same three recordings. CI reads SQLite, not a model saying done.'],
      ['Optional Ollama', 'Local LLM may draft JSON. Python still checks numbers. Off in CI.']
    ],
    steps: [
      'Open the desk. You should see three public URLs: OFAC, White House, AP — not toy pages.',
      'Read the claims table. OFAC denies NABEP / 17 fields; White House and AP state them. $200bn royalties sit on the fact sheet only.',
      'Check the ranking row: “second-largest private producer” vs “second largest operator, behind Chevron.” The desk must not pick one.',
      'Read the OFAC license table (46D, 50C, 52B). A license list is not the fact-sheet deal.',
      'If you run it locally, reject the draft and check SQLite: approved writes stay 0. Approve is refused unless the action is publish_draft.'
    ],
    dependencies: [
      ['Desk loop', 'Three tools plus extractors', 'Fetch, license lookup, prior notes. No other writes.'],
      ['Claims table', 'The three dated recordings', 'Stated / absent / denied / attributed. Not a model summary.'],
      ['Heuristic interpreter', 'Extracted quantities, ranking, scope, attribution', 'CI path. Same actions as the regex baseline.'],
      ['Ollama (optional)', 'Local generate API', 'May propose JSON. Dropped if the host is down.'],
      ['Store', 'SQLite', 'approve() is the only insert into notes.']
    ],
    recordsTitle: 'How the data was organised',
    recordsIntro: 'The public GitHub Pages view is the last claims table (case.json). Local FastAPI uses SQLite. There is no hosted news database and no live OFAC scrape in CI.',
    recordsCaption: 'Records, keys and who may write',
    records: [
      ['recordings/', 'Public URL plus fetch date', 'OFAC and White House as text. AP as quotes only, not a republication.'],
      ['sources / fetches', 'Allowlisted recording id', 'Each fetch stores status and time, including a 429 before retry.'],
      ['drafts', 'case_id plus body hash', 'Pending proposal. Duplicate body hash does not insert a second row.'],
      ['notes', 'draft_id, unique', 'Created only by approve() on action publish_draft.'],
      ['approvals', 'draft_id plus decision', 'Human approve or reject. Reject writes zero notes.']
    ],
    build: [
      'Pin the tools. Anything else, including the model, cannot write.',
      'Compare the three recordings in Python: licenses, named quantities, ranking phrases, and negated sentences.',
      'Score the SQLite snapshot in the harness: notes, approved writes, fetch statuses.',
      'Label every page PUBLIC_RECORDING. Do not invent barrel figures.',
      'Run pytest in CI. Do not call a hosted LLM there.'
    ],
    run: 'python -m pip install -e ".[dev]"\npython -m pytest\npython -m infodesk.harness\npython -m infodesk.app',
    limits: 'Demo and evals, not a shipped newsroom. CI uses dated recordings, not a live OFAC scrape. Ollama is optional and off in CI. A fact sheet is not signed contracts. AP quotes are not the full article. Venezuela oil/sanctions is the example rail, not official access. The public page does not host SQLite.'
  },
  {
    slug: 'relay', name: 'Relay', stack: 'MCP · Python · FastAPI · React · TypeScript',
    summary: 'An evidence desk: four MCP tools and a React UI share one matcher so each skill hit is a quote, not a hiring score.',
    problem: 'An agent or a UI that cites a skill in a job text still needs the sentence it came from. I wanted that quote from one tested service, not a model deciding whether someone qualifies.',
    contribution: 'I connected a React interface and MCP clients to the same Python review service. I implemented source normalization, token-aware matching, duplicate retention and portable exports. The MCP transport uses the official Python SDK. This is not a job-search product.',
    demo: 'https://relay-ten-zeta.vercel.app/', demoLabel: 'Open the demo', code: 'https://github.com/coder058/relay',
    skills: [
      ['Python and FastAPI', 'One evidence service: normalize text, match tokens, keep duplicate wording.'],
      ['MCP', 'Four read-only tools that call the same matcher as the web UI. Official Python SDK.'],
      ['React and TypeScript', 'Paste or sample-board review, quoted lines and export. No eligibility score.'],
      ['Tests', 'pytest in CI for API validation, duplicate wording and MCP transports.']
    ],
    steps: ['Paste a public job description, or load the sample Arbeitnow page to see the matcher work.', 'Add a listing to the review queue. Enter the skills you want to look for.', 'Select Review evidence. Read each matching quotation in its original context: a mention is not necessarily a requirement.', 'Compare duplicate versions without discarding changed text.', 'Export the review or workspace JSON. Saving on this device is optional; do not paste a CV or private correspondence.'],
    dependencies: [
      ['React interface', 'FastAPI JSON endpoints', 'Search, review queue, quote display and export.'],
      ['Public-board reader', 'Arbeitnow public API', 'A bounded latest-page snapshot, not a search of every employer.'],
      ['Evidence service', 'Normalized text, explicit aliases and content hashes', 'Source quotations and duplicate versions; no LLM, eligibility score or application submission.'],
      ['MCP tools', 'Official Python MCP SDK and the same evidence service', 'The browser workflow can also be called from an MCP client.'],
      ['Review state', 'Browser memory; optional device-local storage and JSON files', 'The job service does not persist reviews in a database.'],
      ['Historical safety lab', 'Separate SQLite-backed fixture workflow', 'An older synthetic experiment, not the storage layer for job reviews.']
    ],
    recordsTitle: 'How the data was organised',
    recordsIntro: 'There is no job-review database on the public tool. Records live in the HTTP request and in the browser. SQLite belongs only to an older synthetic safety lab, not to these reviews.',
    recordsCaption: 'Review records and where they live',
    records: [
      ['Job listing', 'Arbeitnow snapshot or pasted public text', 'The source description kept next to each mention.'],
      ['Review', 'Chosen skills plus matched quotations', 'A working set in browser memory; saving on this device is optional.'],
      ['Quoted evidence', 'Normalized text, aliases and a content hash', 'Keeps original wording and duplicate versions; not an eligibility score.'],
      ['Export file', 'JSON written by the visitor', 'Portable copy. The job service does not persist reviews in PostgreSQL.']
    ],
    build: ['Define the job, review and quoted-evidence data models.', 'Normalize input and validate URLs, sizes and fields before reviewing it.', 'Match whole tokens and explicit aliases; keep all changed duplicate descriptions.', 'Expose the same functions through HTTP and MCP instead of maintaining two implementations.', 'Test API validation, source retention, transport behaviour and search regressions; then exercise the browser workflow.'],
    run: '# Backend (inside backend, with a Python virtual environment)\npip install -r requirements.txt\npython -m pytest -q\npython -m uvicorn app.main:app --host 127.0.0.1 --port 8000\n\n# Frontend (inside frontend, in a second terminal)\nnpm ci\nnpm run dev',
    limits: 'This is not a job-search product and not a recruiter ATS. Arbeitnow is a bounded demo snapshot; paste is the path a reviewer will actually use. Matching is literal, not semantic recall: ordinary English such as “react” or “go” can still hit. An agent that calls these tools can still summarise; Relay does not score eligibility or prove a vacancy is open.'
  },
  {
    slug: 'polybow', name: 'Python trading bot', stack: 'Python · WebSockets · AWS Lightsail · CLOB APIs · JSONL recordings',
    summary: 'A 2026 Polymarket experiment: later versions looked for leftover cheap asks, ran from a Dublin VPS, then kept investigating after live trading stopped.',
    problem: [
      'The first version bought expensive contracts near expiry, often around $0.96–$0.99, so correct direction left little upside. Later branches changed the entry price and the timing window. They overlapped; they were not four isolated trials.',
      'The later useful problem was a leftover cheap ask still sitting on the about-to-win side. That is a book condition, not a security hole. UC is the public name for that cheap-entry line.'
    ],
    contribution: [
      'I built and operated the live path: WebSocket books, order preparation, a new AWS Lightsail instance in Dublin, and a recording layout on the VPS. I then treated the live run as evidence to investigate, not as a finished proof.',
      'After live trading stopped, recordings continued. The public repository has the case study, the ledger script and the timing parser. The private bot and raw VPS files are not on this site.'
    ],
    branches: [
      ['v1', 'Near expiry, often $0.96–$0.99', 'Little upside when the direction was right. Oracle updates were too coarse for a five-minute market.'],
      ['StratA', '$0.40–$0.72 with 11–15 seconds remaining', 'More upside per winning trade; more time for the market to reverse.'],
      ['StratB', 'Wider window and a larger gap versus the opening reference', 'Book updates could trigger a decision immediately. Dublin VPS and a warmed execution path. No controlled region comparison.'],
      ['UC', '$0.01–$0.20 leftover cheap asks', 'Maker orders under the ask, later a taker leg. Live trading later stopped.']
    ],
    demo: 'https://polybow-archive.vercel.app/', demoLabel: 'Read the case study', code: 'https://github.com/coder058/polybow-case-study',
    skills: [
      ['Python', 'Bot loop, patches, ledger analysis and the timing parser.'],
      ['WebSockets', 'Book updates triggered evaluation instead of waiting for the next poll.'],
      ['AWS Lightsail (Dublin)', 'A new VPS instance for execution and later daily recordings. No controlled region comparison was run.'],
      ['HTTP/2 and signing', 'A warmed client and coincurve signatures so less work sat on the submit path.'],
      ['Polymarket CLOB API', 'Prepared and posted orders. An acknowledgement is not a fill.'],
      ['JSONL recordings', 'Daily BBO and later L2 files, rotated and compressed on the VPS.'],
      ['CSV ledger', 'The public anonymized market-resolution table and its tests.']
    ],
    steps: [
      'Read the problem first: leftover cheap asks, not the balance chart.',
      'Follow the branch table: early expensive tickets, StratA at $0.40–$0.72, then UC leftover cheap asks.',
      'Read the execution path: Lightsail, warm connection, metadata cache, defined timing window.',
      'Open the data table: how recordings were named and joined. The VPS copies were deleted; the layout is what can still be shown.',
      'Use analyze.py on the public CSV if you want the ledger math. Wallet cash and raw logs stay in the private archive.'
    ],
    dependencies: [
      ['Price reference', 'Chainlink RTDS and, on some paths, Binance', 'Inputs to the historical signal. The archive is not one uniform feed.'],
      ['Outcome books', 'Polymarket WebSocket book events', 'Showed whether a cheap ask was still resting.'],
      ['Decision loop', 'Book callback plus a 5 ms gate (was 50 ms)', 'A throttle, not measured end-to-end latency.'],
      ['Order client', 'HTTP/2, token metadata cache, coincurve', 'Built the signed CLOB request on the VPS.'],
      ['Lightsail instance', 'Ubuntu in eu-west-1 (Dublin)', 'Ran the bot and later the recorders. Location alone is not a benchmark.'],
      ['Public case study', 'Static site plus market_ledger.csv', 'The walkthrough a recruiter can open without the private bot.']
    ],
    recordsTitle: 'How the data was organised',
    recordsIntro: 'The live store was files on the VPS, keyed by market, time and file day. I deleted those copies. This table is the layout, not a download.',
    recordsCaption: 'Recording and research records, as operated on the VPS',
    records: [
      ['ws_books_YYYYMMDD.jsonl', 'BBO recorder on the Lightsail host', 'One file per UTC day: best bid and ask updates. Later gzip-compressed. No order sizes in the early BBO files.'],
      ['ws_books_l2_YYYYMMDD.jsonl', 'L2 recorder, started later', 'Depth at the ask, needed to ask whether a cheap ticket was actually fillable.'],
      ['live.log', 'Bot process on the same host', 'LAT_DETAIL rows for preparation and API-response time. Identifiers stay private; hashes are in EVIDENCE.md.'],
      ['market / window / side', 'Gamma market id plus the five-minute slot', 'The join key from a book event to an order attempt and later to a resolution.'],
      ['market_ledger.csv', 'Anonymized resolution rows in the public repo', 'Reproducible market accounting. It is not the wallet cash series.'],
      ['Later Hyperliquid captures', 'Separate after live Polymarket trading stopped', 'Recorded for analysis that was not finished. Not a second live bot on this page.']
    ],
    build: [
      'Write the early expensive late-entry version (often $0.96–$0.99), then StratA at $0.40–$0.72 with 11–15 seconds remaining, then StratB’s wider window.',
      'Add the cheap-entry line (UC): leftover last-second asks, first as a maker under the ask, then with a taker leg.',
      'Create a Lightsail instance in Dublin, warm the HTTP client, cache metadata and measure a named window: prepare then POST response.',
      'Record books to dated JSONL files and rotate them so a disk-full host could not silently stop the recorder.',
      'After the 28 April CLOB V2 venue change and the 2 May internal guard removal, keep recording and ask whether leftover cheap asks still existed. Later scans of June–July books did not find a durable stale-ask condition; order sizes were missing and August files were gone.',
      'Publish the ledger and timing parser. Label the deleted VPS files and the unfinished later analysis instead of pretending the case is closed.'
    ],
    run: 'python analyze.py\npython -m unittest discover -s tests\nnode --test tests/ledger-ui.test.cjs\npython -m http.server 8084 --bind 127.0.0.1',
    limits: [
      'This was a live experiment, not a finished proof of an edge. Later book scans no longer showed durable leftover cheap asks; that later-market observation does not establish which change caused the result.',
      'Dublin was not compared with another region under the same clock. An API acknowledgement is not a fill. The public CSV is market-resolution accounting, not wallet cash.',
      'Raw recordings, private bot code and later Hyperliquid analysis are not in the public repository. The VPS files were deleted, so this page can show the schema, not replay those days.'
    ],
    references: [['Evidence map', 'https://github.com/coder058/polybow-case-study/blob/main/EVIDENCE.md'], ['Public ledger', 'https://github.com/coder058/polybow-case-study'], ['CLOB V2 date', 'https://docs.polymarket.com/changelog/predictions']]
  },
  {
    slug: 'city-gardens', name: 'City Gardens', stack: 'Ruby on Rails · PostgreSQL · Active Record · JavaScript',
    summary: 'A Le Wagon team project for finding community gardens, reserving parcels and joining garden events.',
    problem: 'A visitor needs to find a garden and understand which parcel or event they can join. Garden information, users and reservations need to refer to the same records.',
    contribution: 'Shared Le Wagon team project, 2023. My merged work included parcel reservations (PR #37), the add-event button (#38), logout (#39), event-index partials, a search bar, Cloudinary for event photos, and styling (#47, #50). I did not build the whole schema alone, and the app is not maintained as a product.',
    code: 'https://github.com/justdevelopin/CityGardens',
    home: '../index.html#more-challenges',
    dependsTitle: 'How the data was organised',
    dependsCaption: 'PostgreSQL tables, foreign keys and responsibility',
    steps: ['The intended visitor flow starts by browsing or searching for a garden.', 'Open a garden to inspect its description, parcels and events.', 'Sign in through Devise before creating a reservation or event booking.', 'A controller associates the new record with the current user and the selected parcel or event.', 'The profile and garden views read those related records back from PostgreSQL. This is a code walkthrough, not a verified live demo.'],
    dependencies: [
      ['users', 'Devise authentication', 'Accounts referenced by gardens, bookings, bookmarks, reviews and parcel reservations.'],
      ['gardens', 'gardens.user_id → users.id', 'Garden details and location; a garden has parcels and events.'],
      ['parcels', 'gardens through garden_id', 'A parcel belongs to one garden.'],
      ['parcel_reservations', 'users and parcels through user_id and parcel_id', 'Connects a member to a reserved parcel; includes status and duration.'],
      ['events', 'gardens through garden_id', 'Event details, date and capacity.'],
      ['bookings', 'users and events through user_id and event_id', 'Connects an attendee to an event and records attendee count.'],
      ['bookmarks and reviews', 'A user plus a garden or reviewable record', 'Saved gardens and feedback; reviews use a polymorphic target.'],
      ['Photos and maps', 'Active Storage/Cloudinary and geocoding integration', 'Media and coordinates support the views; external configuration is required.']
    ],
    build: ['Start with the visitor journey: find a garden, inspect it, make a reservation.', 'Translate the nouns into models and foreign keys before building the screens.', 'Use Rails routes to send an HTTP request to a controller action.', 'Use Active Record to load or validate related records and write to PostgreSQL.', 'Render the result in a view and test ownership, validation and failure paths, not only the happy path.'],
    limits: 'The current README is only a Cloudinary snippet. Inspection also found a missing reservation-parameter method, a User-to-parcels association that does not match the schema, and duplicated garden callbacks. I have not altered the shared repository or presented these paths as verified. Use this project as historical team and data-modelling evidence.',
    references: [['Schema', 'https://github.com/justdevelopin/CityGardens/blob/master/db/schema.rb'], ['Routes', 'https://github.com/justdevelopin/CityGardens/blob/master/config/routes.rb'], ['Models', 'https://github.com/justdevelopin/CityGardens/tree/master/app/models']]
  }
];
