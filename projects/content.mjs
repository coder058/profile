// SOURCE: the linked project repositories, inspected 6 September 2026.
// These are dependency relationships, not claims of production scale or employment.
export const projects = [
  {
    slug: 'pattern-forge', name: 'Pattern Forge', stack: 'React · TypeScript · Next.js · WebSockets',
    summary: 'Inspect a candlestick pattern, read its market context and rewind the recording. The chart recalculates from the available candle prefix, without using later prices.',
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
      'Choose a market and interval. Public Bitcoin loads a closed-candle snapshot; Gold and the other recorded markets use dated files.',
      'Choose Candlestick patterns and Bullish engulfing. Inspect the highlighted candle pair; a shape is not a prediction of the next price.',
      'Switch to Trend & location for Murphy-inspired context. Add supporting indicators only if you want them; drawing is optional.',
      'Rewind a recording and step forward. Later candles stay out of indicator calculations.',
      'For an hourly recording, select 4h and Preview forming 4h. The amber body uses only closed hourly input; it may change before the four-hour close.',
      'Export the selected closed-candle prefix. Provisional bodies never enter the export. Refresh reloads public candles; it does not turn an archive into a live feed.'
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
      ['candles table', 'Primary key (symbol, interval, open_time)', 'Upserts OHLCV and ingestion time. Revisions replace the row; this is not immutable history.'],
      ['ingest_runs table', 'Each ingestion attempt', 'Stores source, counts, timing and errors in a separate transaction from candle writes.'],
      ['Stored-candle API (local/CI)', 'PostgreSQL through the pg client and DATABASE_URL', 'Reads saved candles into the existing chart. An empty store returns 404; an unavailable database returns 503.'],
      ['Public demo storage', 'Recording files and temporary process memory', 'No user accounts and no hosted PostgreSQL on Vercel.']
    ],
    build: ['Define a candle format with timestamps and OHLC values.', 'Reject malformed, conflicting and still-forming candles at the boundary.', 'Calculate indicators from the selected prefix, then render the result in React.', 'Keep the streaming mid-price separate from historical calculations.', 'Test malformed inputs, partial upstream failures, replay causality and connection cleanup; build and run the Docker image in CI.'],
    run: 'npm ci\nnpm test\nnpm run build\nnpm start',
    limits: 'The quote timestamp is local receipt time, not an exchange-latency benchmark. Public candles update on Refresh. The oil and other archive datasets are recordings. The repository also includes PostgreSQL persistence for local Docker and CI; the public Vercel demo does not serve that database. The README explains ingestion, duplicate handling and restart checks. This is a read-only analysis tool, not a trading terminal or a profitable strategy.'
  },
  {
    slug: 'info-desk', name: 'Info Desk', stack: 'Python · FastAPI · SQLite · limited tools',
    summary: 'Which claims are actually supported by the sources? Info Desk puts a finding beside its original passage, keeps disagreements visible and lets a person review the result.',
    problem: 'A fluent summary can make different sources sound as though they agree. A government announcement, a license list and a news report do not necessarily support the same claim. Reading the summary alone can hide those differences.',
    contribution: 'I built a comparison table that links findings to exact passages, plus checks for cited numbers and a database approval step in the local app. This page includes the recorded case below. Fresh source collection and AI answers run in a separate local service; they are not running inside this public example.',
    inlineDemo: true,
    overview: [
      ['Do the sources agree?', 'Compare each claim with the actual passages.', 'Different wording and missing information remain visible instead of becoming one confident summary.'],
      ['Can I check an AI draft?', 'Attach references and reject unknown citations or unsupported numbers.', 'A traceable quote is a starting point for review, not proof that the interpretation is correct.'],
      ['Who decides what gets saved?', 'Keep drafts separate from approved notes in the local database.', 'Model output cannot approve its own write. The public recording does not perform database writes.']
    ],
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
      'Read the claims table. The OFAC recording does not name NABEP / 17 fields; White House and AP state them. $200bn royalties sit on the fact sheet only.',
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
    recordsIntro: 'The public GitHub Pages view is the recorded claims table (case.json). The repository also has a local FastAPI live workspace with versioned SQLite captures. It is not publicly hosted, so the public card remains an inspectable recorded case rather than a live service.',
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
    limits: 'The public page is a recorded case. The live workspace runs locally and requires an appropriate hosted backend, access controls, persistent storage and an inference configuration before it can be offered as a public service. CI uses dated recordings. A fact sheet is not signed contracts, and AP quotes are not the full article.'
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
    slug: 'fly-brain',
    name: 'Fly Brain',
    pageClass: 'fly-brain-case',
    featuredStory: true,
    summary: 'Can the wiring of a fruit fly’s brain help a computer remember a signal? I am building small simulations to test that question. The experiment is still unfinished.',
    stack: 'PYTHON · NUMPY · SCIPY · PYTEST',
    code: 'https://github.com/coder058/fly-brain',
    problem: [
      'Scientists have mapped connections between a fruit fly’s neurons. A map tells us what connects to what; it does not tell us whether a computer using those connections can learn or remember.',
      'I want to compare the original wiring with altered versions under the same conditions. First, both simulations need to respond reliably. Otherwise, a difference could come from a broken experiment rather than the wiring.'
    ],
    contribution: [
      'I built Python scripts that load the connection map, run controlled simulations and save what happened at each step.',
      'The scripts check whether a run is active enough to compare, protect the original data and keep failed attempts in the results. I have not demonstrated memory or a useful advantage over another design.'
    ],
    skills: [
      ['Python + NumPy/SciPy', 'Load a large connection map and calculate simulated activity without storing every possible connection.'],
      ['JSON + experiment records', 'Save the settings, measurements and reasons a run failed.'],
      ['pytest + Git', 'Check the code and track changes so an experiment can be repeated.']
    ],
    stepsTitle: 'The experiment, step by step',
    steps: [
      'Load the published fruit-fly connection map.',
      'Send a controlled signal into a small simulation.',
      'Check that the original and comparison versions both respond.',
      'Only then test whether information about the signal remains after a delay.',
      'Save the result, including failures, so someone else can inspect it.'
    ],
    dependsTitle: 'How it works',
    dependsCaption: 'From source data to a result',
    dependencies: [
      ['Connection map', 'Published MaleCNS v1.0 data', 'Keeps the original wiring fixed.'],
      ['Simulation', 'The map and a written experiment plan', 'Calculates how activity changes after an input.'],
      ['Checks', 'Activity from each simulation', 'Decides whether the runs can be compared fairly.'],
      ['Result record', 'Settings, checks and measurements', 'Shows what ran and what remains unanswered.']
    ],
    recordsTitle: 'What gets saved',
    recordsCaption: 'Data and experiment records',
    recordsIntro: 'The original data, the experiment settings and the results are kept separate.',
    records: [
      ['Source record', 'Original files and their hashes', 'Identifies the exact data used.'],
      ['Experiment plan', 'Question, inputs and comparison rules', 'Records what will be tested before running it.'],
      ['Run results', 'Measurements and failure reasons', 'Keeps unsuccessful runs visible too.']
    ],
    endingTitle: 'What works, and what is still missing',
    ending: [
      'The code can load the map, run simulations and record checks. Recent experiments did not produce a valid pair of original and comparison runs for the intended memory test.',
      'Next: get a repeatable comparison working before measuring memory. This is a research exercise, not a simulation of a living fly or a demonstrated AI product. The repository contains the detailed protocols and results.'
    ]
  },
  {
    slug: 'polybow',
    name: 'Polybow — Python trading bot',
    pageClass: 'polybow-case',
    featuredStory: true,
    hideNav: true,
    summary: 'An independently operated Python system for live market-data capture and signed order execution on five-minute prediction markets—followed by a postmortem when the setup stopped finding durable opportunities.',
    problem: [
      'Five-minute crypto markets compress the entire execution problem into seconds. Polybow had to identify the correct asset, time window and outcome token; compare the live price reference with the opening level; watch both outcome books; and submit an order before the quoted liquidity changed.',
      'The candidate edge was not “predict whether Bitcoin goes up.” It was narrower: a very cheap ask could remain on the side that was close to resolving as the winner. The opportunity only existed if that ask was real, large enough and still present after detection, signing and submission.',
      'Three records could tell different stories. A reference feed described direction, a WebSocket event described the visible book, and the CLOB account described orders and fills. An API acknowledgement was therefore not proof of execution, and a market name alone could not identify which bot branch placed an order.'
    ],
    branches: [
      ['v1', 'Near expiry, often $0.96–$0.99', 'Entered the apparent winner late. Correct direction left little upside, while a reversal could lose almost the full ticket.'],
      ['StratA', '$0.40–$0.72 with 11–15 seconds remaining', 'Moved entry earlier and lower to improve payoff, accepting more time for the underlying market to reverse.'],
      ['StratB', 'A wider timing window plus a larger gap from the opening reference', 'Made book updates event-driven, cached market metadata and warmed the signed HTTP/2 submission path.'],
      ['UC', '$0.01–$0.20 leftover asks', 'Targeted cheap residual liquidity with a maker order below the ask and, later, a taker leg when the quote remained available.']
    ],
    contribution: [
      'I designed, built and operated the end-to-end path: market discovery, outcome-token mapping, reference-price handling, WebSocket book ingestion, decision logic, signed CLOB orders and the Ubuntu service running on AWS Lightsail.',
      'I moved evaluation into the book callback, reduced the decision gate from 50 ms to 5 ms, cached market metadata, kept an HTTP/2 client warm and used coincurve signing to remove avoidable work from the submit path. Timing logs separated preparation from API response instead of treating either as fill latency.',
      'I also built the evidence path around the bot: daily BBO and L2 JSONL recorders, rotation and compression, structured timing logs, a market-resolution ledger and parsers used for the postmortem. That made it possible to distinguish a visible quote, an order acknowledgement and later account activity.',
      'This was an independent project. I owned the system design, implementation, deployment, operation and investigation.'
    ],
    code: 'https://github.com/coder058/polybow-case-study',
    dependencyMap: true,
    dependsTitle: 'How the system fits together',
    dependenciesIntro: 'The live path moved left to right. Identity and reference data selected the contract; book events triggered a decision; the order client signed and submitted it; the evidence layer recorded what each stage actually knew.',
    dependencies: [
      ['Market identity', 'Gamma market metadata + five-minute window', 'Asset, window, condition ID and outcome-token IDs.'],
      ['Price reference', 'Chainlink RTDS; Binance on some branches', 'Opening level, latest price and candidate direction.'],
      ['Outcome books', 'Polymarket WebSocket events', 'Best bids and asks for both outcome tokens.'],
      ['Decision loop', 'Identity + reference + book + timing and price guards', 'A prepared order candidate—or no action.'],
      ['Order client', 'Cached metadata + HTTP/2 + CLOB authentication + coincurve', 'A signed order request and named response timings.'],
      ['Runtime', 'Ubuntu on AWS Lightsail in Dublin', 'The bot process, restart path and daily recorder jobs.'],
      ['Evidence layer', 'Book events + timing logs + account and resolution records', 'A traceable postmortem instead of a success claim based on acknowledgements.']
    ],
    recordMap: true,
    recordsTitle: 'How the data connects',
    recordsIntro: 'The common join was market + five-minute window + outcome side. Each record answered a different question, so no single file was treated as the complete truth.',
    records: [
      ['market / window / side', 'Gamma identifiers and outcome-token mapping', 'The key connecting a quote, order attempt, account event and resolution.'],
      ['ws_books_YYYYMMDD.jsonl', 'Daily best-bid / best-ask WebSocket events', 'What price was visible and when it reached the recorder.'],
      ['ws_books_l2_YYYYMMDD.jsonl', 'Later depth snapshots', 'Whether cheap quoted liquidity had enough visible size to matter.'],
      ['live.log', 'Decision and submission instrumentation', 'Separate preparation and API-response timings for each attempt.'],
      ['market_ledger.csv', 'Public anonymized market-resolution rows', 'Reproducible outcome accounting for the historical case.'],
      ['Public wallet activity', 'Polymarket profile + Polygon transaction history', 'Externally visible account activity that can be inspected independently.']
    ],
    endingTitle: 'Why the opportunity stopped working',
    ending: [
      'UC depended on persistence: a low-priced ask had to remain in the winning-side book long enough to detect, sign and fill. On 28 April the venue moved to CLOB V2; on 2 May I also changed internal bot guards. Those changes overlapped, so the evidence cannot isolate one patch as the cause.',
      'What the later data does establish is that the executable condition was no longer durable. A June–July scan covered 12,929 markets and 104.5 million best-book updates. It found one trigger, while apparent crosses disappeared within 0.02 seconds—too quickly for the earlier detect-and-submit path to rely on.',
      'The defensible conclusion is that the residual-ask setup stopped appearing as a repeatable opportunity in the later books. Saying that one specific patch killed a proven edge would go beyond the evidence.',
      'After live Polymarket trading stopped, I shifted the research workflow to capturing and replaying Hyperliquid public market data. That was a new data-research direction, not a claim that a second live bot was operated.'
    ],
    accountTitle: 'Inspect the real public activity',
    accountIntro: 'These links expose the account and historical ledger directly. They are evidence of activity and resolved outcomes; they are not presented as proof of durable profitability.',
    accountLinks: [
      ['Polymarket profile', 'https://polymarket.com/profile/0x0022C02Dda115a6E0307007881a6e19394883DB0', 'Public profile for 0x0022…3DB0'],
      ['Polygon wallet', 'https://polygonscan.com/address/0x0022C02Dda115a6E0307007881a6e19394883DB0', 'Independent on-chain transaction history'],
      ['Resolution ledger', 'https://github.com/coder058/polybow-case-study/blob/main/data/market_ledger.csv', 'Public CSV used by the historical case study']
    ],
    labCoda: {
      title: 'Reconciliation lab',
      text: 'A separate synthetic backend exercise about duplicate delivery, partial fills and conflicting records. It comes after the historical case so its generated inputs cannot be mistaken for Polybow’s live activity.',
      url: 'https://coder058.github.io/profile/projects/reconciliation/',
      label: 'Open the separate technical lab'
    }
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
