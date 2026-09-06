// SOURCE: the linked project repositories, inspected 6 September 2026.
// These are dependency relationships, not claims of production scale or employment.
export const projects = [
  {
    slug: 'pattern-forge', name: 'Pattern Forge', stack: 'React · TypeScript · Next.js · WebSockets',
    summary: 'A workspace for exploring public crypto prices and replaying recorded markets without seeing the future.',
    problem: 'When reviewing a market, it is easy to let later prices influence an earlier decision. I wanted to inspect what an indicator could actually have shown at a chosen point in time.',
    contribution: 'I built the market controls, data validation, replay calculations, candle API and connection handling. TradingView Lightweight Charts renders the chart; I did not build that charting library.',
    demo: 'https://pattern-forge-five.vercel.app/', code: 'https://github.com/coder058/pattern-forge',
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
      ['Public demo storage', 'Recording files and temporary process memory', 'The Vercel demo does not serve stored candles or provide user accounts.'],
      ['Python ingester (local/CI)', 'Validated public candles or a recorded fixture, psycopg and PostgreSQL', 'Writes closed candles; records each attempt and its fetch/write timing.'],
      ['candles table', 'Primary key (symbol, interval, open_time)', 'Prevents duplicate rows on repeated ingestion; stores OHLCV values and ingestion time.'],
      ['ingest_runs table', 'Each ingestion attempt', 'Stores source, row counts, timing and errors separately from candle data.'],
      ['Stored-candle API (local/CI)', 'PostgreSQL through the pg client and DATABASE_URL', 'Reads saved candles into the existing chart. An empty store returns 404; an unavailable database returns 503.']
    ],
    build: ['Define a candle format with timestamps and OHLC values.', 'Reject malformed, conflicting and still-forming candles at the boundary.', 'Calculate indicators from the selected prefix, then render the result in React.', 'Keep the streaming mid-price separate from historical calculations.', 'Test malformed inputs, partial upstream failures, replay causality and connection cleanup; build and run the Docker image in CI.'],
    run: 'npm ci\nnpm test\nnpm run build\nnpm start',
    limits: 'The quote timestamp is local receipt time, not an exchange-latency benchmark. Public candles update on Refresh. The oil and other archive datasets are recordings. The repository also includes PostgreSQL persistence for local Docker and CI; the public Vercel demo does not serve that database. The README explains ingestion, duplicate handling and restart checks. This is a read-only analysis tool, not a trading terminal or a profitable strategy.'
  },
  {
    slug: 'relay', name: 'Relay', stack: 'MCP · Python · FastAPI · React · TypeScript',
    summary: 'A job-requirement review tool that keeps the original wording beside each skill mention.',
    problem: 'A job summary can lose important qualifications, exceptions or changes to a listing. I wanted the original text to remain inspectable instead of asking a model to decide whether someone qualifies.',
    contribution: 'I connected a React interface and MCP clients to the same Python review service. I implemented source normalization, token-aware matching, duplicate retention and portable exports. The MCP transport uses the official Python SDK.',
    demo: 'https://relay-ten-zeta.vercel.app/', code: 'https://github.com/coder058/relay',
    skills: [
      ['Python and FastAPI', 'One evidence service: normalize text, match tokens, keep duplicate wording.'],
      ['MCP', 'Four read-only tools that call the same matcher as the web UI. Official Python SDK.'],
      ['React and TypeScript', 'Search, review queue, quoted lines and export. No eligibility score.'],
      ['Tests', '48 backend tests for input validation, source retention and protocol behaviour.']
    ],
    steps: ['Search the public board by keyword and location, or paste a public job description.', 'Add a listing to the review queue. Enter the skills you want to look for.', 'Select Review evidence. Read each matching quotation in its original context: a mention is not necessarily a requirement.', 'Compare duplicate versions without discarding changed text.', 'Export the review or workspace JSON. Saving on this device is optional; do not paste a CV or private correspondence.'],
    dependencies: [
      ['React interface', 'FastAPI JSON endpoints', 'Search, review queue, quote display and export.'],
      ['Public-board reader', 'Arbeitnow public API', 'A bounded latest-page snapshot, not a search of every employer.'],
      ['Evidence service', 'Normalized text, explicit aliases and content hashes', 'Source quotations and duplicate versions; no LLM, eligibility score or application submission.'],
      ['MCP tools', 'Official Python MCP SDK and the same evidence service', 'The browser workflow can also be called from an MCP client.'],
      ['Review state', 'Browser memory; optional device-local storage and JSON files', 'The job service does not persist reviews in a database.'],
      ['Historical safety lab', 'Separate SQLite-backed fixture workflow', 'An older synthetic experiment, not the storage layer for job reviews.']
    ],
    build: ['Define the job, review and quoted-evidence data models.', 'Normalize input and validate URLs, sizes and fields before reviewing it.', 'Match whole tokens and explicit aliases; keep all changed duplicate descriptions.', 'Expose the same functions through HTTP and MCP instead of maintaining two implementations.', 'Test API validation, source retention, transport behaviour and search regressions; then exercise the browser workflow.'],
    run: '# Backend (inside backend, with a Python virtual environment)\npip install -r requirements.txt\npython -m pytest -q\npython -m uvicorn app.main:app --host 127.0.0.1 --port 8000\n\n# Frontend (inside frontend, in a second terminal)\nnpm ci\nnpm run dev',
    limits: 'Coverage is one public board page plus descriptions supplied by the visitor. Matching is literal, not semantic understanding or proof that a vacancy is still open. An ordinary use of a word such as “react” can still require human interpretation.'
  },
  {
    slug: 'polybow', name: 'Polybow', stack: 'Python · WebSockets · AWS Lightsail · CLOB APIs · JSONL recordings',
    summary: 'A live Polymarket system: find last-second cheap asks left on the book, reach them from a Dublin VPS, then keep investigating after live trading stopped.',
    problem: [
      'Early Polybow, StratA and StratB bought expensive contracts near expiry, often around $0.96–$0.99. Those tickets had little upside even when the direction was right. The useful problem appeared later: a cheap ask still sitting on the about-to-win side while the other side already looked decided.',
      'That leftover cheap ask is a book condition, not a security hole. The work was to notice it, reach it before it disappeared, and later test whether it was still there after the venue changed. UC is the public name for that cheap-entry line.'
    ],
    contribution: [
      'I built and operated the live path: WebSocket books, order preparation, a new AWS Lightsail instance in Dublin, and a recording layout on the VPS. I then treated the live run as evidence to investigate, not as a finished proof.',
      'After live trading stopped, recordings and later Hyperliquid captures continued. The public repository has the case study, the ledger script and the timing parser. The private bot, raw VPS files and unfinished later analysis are not on this site. Live trading ended; the investigation did not.'
    ],
    demo: 'https://polybow-archive.vercel.app/', code: 'https://github.com/coder058/polybow-case-study',
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
      'Follow the branch table: expensive late tickets, then UC cheap entry.',
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
    recordsIntro: 'City Gardens shows foreign keys in PostgreSQL. Here the live store was files on the VPS, keyed by market, time and file day. I deleted the VPS recordings. This table is the layout I used, not a download.',
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
      'Write the expensive late-entry versions (Polybow, StratA, StratB) and record why upside was thin at $0.96–$0.99.',
      'Add the cheap-entry line (UC): last-second asks, first as a maker under the ask, then with a taker leg.',
      'Create a Lightsail instance in Dublin, warm the HTTP client, cache metadata and measure a named window: prepare then POST response.',
      'Record books to dated JSONL files and rotate them so a disk-full host could not silently stop the recorder.',
      'After the 28 April CLOB V2 venue change and the 2 May internal guard removal, keep recording and ask whether leftover cheap asks still existed. Later scans of June–July books did not find a durable stale-ask condition; order sizes were missing and August files were gone.',
      'Publish the ledger and timing parser. Label the deleted VPS files and the unfinished later analysis instead of pretending the case is closed.'
    ],
    run: 'python analyze.py\npython -m unittest discover -s tests\nnode --test tests/ledger-ui.test.cjs\npython -m http.server 8084 --bind 127.0.0.1',
    limits: [
      'This was a live experiment, not a finished proof of an edge. Later book scans no longer showed durable leftover cheap asks; that is a later-market observation, not a courtroom link to one patch.',
      'Dublin was not compared with another region under the same clock. An API acknowledgement is not a fill. The public CSV is market-resolution accounting, not wallet cash.',
      'Raw recordings, private bot code and later Hyperliquid analysis are not in the public repository. The VPS files were deleted, so this page can show the schema, not replay those days.'
    ],
    references: [['Evidence map', 'https://github.com/coder058/polybow-case-study/blob/main/EVIDENCE.md'], ['Public ledger', 'https://github.com/coder058/polybow-case-study'], ['CLOB V2 date', 'https://docs.polymarket.com/changelog/predictions']]
  },
  {
    slug: 'city-gardens', name: 'City Gardens', stack: 'Ruby on Rails · PostgreSQL · Active Record · JavaScript',
    summary: 'A Le Wagon team project for finding community gardens, reserving parcels and joining garden events.',
    problem: 'A visitor needs to find a garden and understand which parcel or event they can join. Garden information, users and reservations need to refer to the same records.',
    contribution: 'This was a shared Le Wagon project in 2023, not my sole-authored application. The repository and commit history are the evidence of the team’s work. This page explains the model and request flow found in that code; it does not claim that the old app is production-ready today.',
    code: 'https://github.com/justdevelopin/CityGardens',
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
