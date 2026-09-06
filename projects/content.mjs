// SOURCE: the linked project repositories, inspected 6 September 2026.
// These are dependency relationships, not claims of production scale or employment.
export const projects = [
  {
    slug: 'pattern-forge', name: 'Pattern Forge', stack: 'React · TypeScript · Next.js · WebSockets',
    summary: 'A workspace for exploring public crypto prices and replaying recorded markets without seeing the future.',
    problem: 'When reviewing a market, it is easy to let later prices influence an earlier decision. I wanted to inspect what an indicator could actually have shown at a chosen point in time.',
    contribution: 'I built the market controls, data validation, replay calculations, candle API and connection handling. TradingView Lightweight Charts renders the chart; I did not build that charting library.',
    demo: 'https://pattern-forge-five.vercel.app/', code: 'https://github.com/coder058/pattern-forge',
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
      ['Storage', 'Public recording files and temporary memory', 'No SQL database, user accounts or durable server-side workspace.']
    ],
    build: ['Define a candle format with timestamps and OHLC values.', 'Reject malformed, conflicting and still-forming candles at the boundary.', 'Calculate indicators from the selected prefix, then render the result in React.', 'Keep the streaming mid-price separate from historical calculations.', 'Test malformed inputs, partial upstream failures, replay causality and connection cleanup; build and run the Docker image in CI.'],
    run: 'npm ci\nnpm test\nnpm run build\nnpm start',
    limits: 'The quote timestamp is local receipt time, not an exchange-latency benchmark. Public candles update on Refresh. The oil and other archive datasets are recordings. This is a read-only analysis tool, not a trading terminal or a profitable strategy.'
  },
  {
    slug: 'relay', name: 'Relay', stack: 'MCP · Python · FastAPI · React · TypeScript',
    summary: 'A job-requirement review tool that keeps the original wording beside each skill mention.',
    problem: 'A job summary can lose important qualifications, exceptions or changes to a listing. I wanted the original text to remain inspectable instead of asking a model to decide whether someone qualifies.',
    contribution: 'I connected a React interface and MCP clients to the same Python review service. I implemented source normalization, token-aware matching, duplicate retention and portable exports. The MCP transport uses the official Python SDK.',
    demo: 'https://relay-ten-zeta.vercel.app/', code: 'https://github.com/coder058/relay',
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
    slug: 'polybow', name: 'Polybow', stack: 'Python · WebSockets · APIs · AWS Lightsail',
    summary: 'A trading experiment and its postmortem: how the signal and execution path changed, and why faster responses did not establish a durable edge.',
    problem: 'A short-lived disagreement between BTC direction and an outcome contract was only useful if the quote was real, enough shares were available and the order arrived in time.',
    contribution: 'I worked on the signal and execution experiments and the later analysis. The public repository contains the case study, ledger calculations and a timing parser, not the private trading bot. It is an engineering investigation, not a deployable strategy.',
    demo: 'https://polybow-archive.vercel.app/', code: 'https://github.com/coder058/polybow-case-study',
    steps: ['Read the Polybow, StratA, StratB and UC branches and the problem each change addressed.', 'Follow the execution section: book events, warm connections, metadata preparation and order submission.', 'Read the timing definition before interpreting the numbers. An API response is not a confirmed fill.', 'Expand Inspect the trading record and compare the market ledger with the separately explained wallet cash result.', 'Use the public CSV and analysis script to reproduce the ledger calculation. Private input logs are needed to reproduce the archived timing statistics.'],
    dependencies: [
      ['Historical signal', 'BTC reference prices and outcome order books', 'Inputs to the private bot; not a feed running on this website.'],
      ['Order preparation', 'Market metadata, signing and an HTTP client', 'Prepared requests for the CLOB API in the historical experiment.'],
      ['Timing analysis', 'Archived log records and latency.py', 'Preparation-to-response statistics, not end-to-end fill latency. Raw logs are not public.'],
      ['Public ledger analysis', 'Anonymized market_ledger.csv and analyze.py', 'Reproducible market-resolution accounting.'],
      ['Browser case study', 'Static HTML, JavaScript and the public CSV', 'The explanation, ledger filters and chart.'],
      ['Storage', 'Archived logs and CSV files', 'No live account, order endpoint or application database in the public site.']
    ],
    build: ['Define the signal hypothesis and record the inputs used by each branch.', 'Move evaluation to book events and reduce avoidable preparation work.', 'Measure a specifically defined timing window rather than comparing unrelated intervals.', 'Reconcile outcomes and retain losses, uncertainty and differences between accounting methods.', 'Publish the reproducible ledger analysis and label what cannot be independently reproduced from the public repository.'],
    run: 'python analyze.py\npython -m unittest discover -s tests\nnode --test tests/ledger-ui.test.cjs\npython -m http.server 8084 --bind 127.0.0.1',
    limits: 'The experiment did not establish durable profitability. Dublin was not evaluated with a controlled regional comparison. The public CSV is market-resolution accounting, not the wallet cash balance. Private bot code and raw latency logs are not included.'
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
