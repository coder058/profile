import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('selected projects are single-link cards with current names', () => {
  for (const name of ['Relay', 'Pattern Forge', 'Info Desk', 'Python trading bot']) assert.ok(html.includes(`<h3>${name}</h3>`));
  assert.doesNotMatch(html, /<h3>DispatchOps<\/h3>|<h3>Transcript Desk<\/h3>|Source &amp; tests|OPEN WORK|project-index/);
  // SOURCE: user's September review removes the game from featured work.
  assert.equal((html.match(/class="project-card /g) || []).length, 4);
  assert.equal((html.match(/class="project-source"/g) || []).length, 0);
  assert.match(html, /MCP · PYTHON · TYPESCRIPT/);
  assert.ok(html.includes('rel="canonical" href="https://coder058.github.io/profile/"'));
});
test('local styles, scripts, images and resume exist', () => {
  for (const [, target] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    assert.ok(existsSync(new URL('../' + target.split('?')[0], import.meta.url)), target);
  }
});

test('portfolio copy is personal without duplicating the resume', () => {
  assert.match(html, /<p class="hero-summary">I like tackling everyday problems that used to take too long/);
  assert.doesNotMatch(html, /An agent can call them|AI tools that share the same path|complex systems break down/);
  assert.doesNotMatch(html, /enterprise customer|FDE|model training|Market-data interfaces/);
  assert.doesNotMatch(html, /Software developer in Amsterdam/);
  assert.doesNotMatch(html, /Full-stack developer/i);
  assert.doesNotMatch(html, /I’m curious about how things work/);
  assert.doesNotMatch(html, /coding agents to explore possible answers/);
  assert.doesNotMatch(html, /open to relocation|Python, TypeScript (?:&amp;|and) SQL/i);
  // SOURCE: recruiter review 6 Sep 2026 — Pattern Forge is the main demo.
  assert.ok(html.indexOf('<h3>Pattern Forge</h3>') < html.indexOf('<h3>Info Desk</h3>'));
  assert.ok(html.indexOf('<h3>Info Desk</h3>') < html.indexOf('<h3>Relay</h3>'));
  assert.ok(html.indexOf('<h3>Relay</h3>') < html.indexOf('<h3>Python trading bot</h3>'));
  assert.doesNotMatch(html, /id="about"|about-title|about-copy|about-note/);
});

test('a reader can scan the stack and the evidence behind each project', () => {
  for (const tool of ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'])
    assert.ok(html.includes(`<li>${tool}</li>`), tool);
  // SOURCE: counts and deployment checks recorded in the 5-6 September project audits.
  assert.equal((html.match(/class="project-proof"/g) || []).length, 4);
  assert.match(html, /No look-ahead · CI Docker \/ Postgres restart/);
  assert.match(html, /The public demo does not serve that database/);
  assert.match(html, /Four MCP tools and a React UI share one matcher/);
  assert.match(html, /pytest in CI · one review service behind HTTP and MCP/);
  assert.match(html, /Lightsail · WebSockets · JSONL recordings/);
  assert.match(html, /Open BTC 5m/);
  assert.match(html, /Load the board/);
  assert.match(html, /Open the ledger/);
  assert.match(html, /pattern-forge-five\.vercel\.app/);
  assert.match(html, /relay-ten-zeta\.vercel\.app/);
  assert.match(html, /polybow-archive\.vercel\.app/);
  assert.match(html, /Cited claims · approval ledger · regression harness/);
  assert.match(html, /coder058\.github\.io\/info-desk/);
  // SOURCE: 10 Sep 2026 audit — the public URL serves a recorded case, not the local live workspace.
  assert.match(html, /A recorded evidence case/);
  assert.match(html, /local live-research workspace/);
  assert.equal((html.match(/class="project-data"/g) || []).length, 4);
  for (const slug of ['polybow', 'pattern-forge', 'relay', 'info-desk']) {
    assert.ok(html.includes(`href="projects/${slug}.html#data"`), slug);
  }
});

test('training work links only to destinations that are actually public', () => {
  assert.doesNotMatch(html, />Challenges</);
  assert.match(html, /<h2 id="challenges-title">Training work<\/h2>/);
  assert.match(html, /class="challenges-window"/);
  assert.doesNotMatch(html, /Other projects|DispatchOps|Transcript Desk|not sole-authored|Selected course exercises/);
  const css = readFileSync(new URL('../presentation.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /challenges-window\{[^}]*min-height:calc\(100vh/);
  // SOURCE: 10 Sep 2026 link check — the seven js-* repositories are private and returned 404.
  for (const dead of ['js-geocoder', 'js-fork-restaurants', 'js-weather', 'js-ask-an-ai',
    'js-ajax-autocomplete', 'js-anonymous-chat', 'js-ajax-search', 'q=js-']) {
    assert.doesNotMatch(html, new RegExp(dead.replace('=', '=')), dead);
  }
  assert.match(html, /rails-task-manager/);
  assert.match(html, /rails-wikinimous/);
  assert.match(html, /City Gardens \(team\)/);
  assert.doesNotMatch(html, /unfinished scaffold/);
  assert.doesNotMatch(html, /200 challenges|every Le Wagon Kitt challenge was completed/i);
  assert.doesNotMatch(html, /lewagon-api-lab/);
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="more-challenges"'));
  assert.equal((html.match(/class="project-card /g) || []).length, 4);
});

test('four cards fill a two-column grid without a stretched last row', () => {
  const squares = readFileSync(new URL('../project-squares.css', import.meta.url), 'utf8');
  const ready = readFileSync(new URL('../application-ready.css', import.meta.url), 'utf8');
  assert.match(squares, /\.project-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  // SOURCE: 10 Sep 2026 audit — the last card used to span the full row and left a gap.
  assert.doesNotMatch(ready, /\.project-card:last-child\{grid-column:1\/-1\}/);
});

test('the resume page offers selectable text and the ATS file, not only an image', () => {
  const resume = readFileSync(new URL('../resume.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../resume-packs.css', import.meta.url), 'utf8');
  assert.match(resume, /class="resume-text"/);
  assert.match(resume, /ATS PDF \(text-selectable\)/);
  assert.match(resume, /Haystack #12635/);
  // SOURCE: full résumé text is now generated from the same data as the PDFs.
  assert.match(resume, /<h2>Experience<\/h2>/);
  assert.match(resume, /<h2>Education &amp; training<\/h2>/);
  assert.match(resume, /De Bommel/);
  assert.match(resume, /Info Desk/);
  assert.match(resume, /<details class="resume-preview">/);
  assert.doesNotMatch(css, /\.resume-text\{[^}]*display:none/);
});

test('the published apply-pack is a CV manifest with no internal instructions', () => {
  const raw = readFileSync(new URL('../apply-pack.json', import.meta.url), 'utf8');
  const pack = JSON.parse(raw);
  assert.deepEqual(pack.packs.map((item) => item.id), ['fullstack', 'ai', 'data', 'software', 'fde']);
  assert.equal(pack.default_pack, 'software');
  // SOURCE: 10 Sep 2026 audit — the public URL exposed local paths and prepared answers.
  for (const leak of ['form_answers', 'how_to_submit', 'pack_selection', 'never_claim',
    'log_applications_to', 'letter_template', 'ready_to_apply', 'salary', 'notice_period',
    'C:\\\\Users', 'output/pdf']) {
    assert.ok(!raw.includes(leak), leak);
  }
  for (const entry of pack.packs) {
    assert.match(entry.sha256_ats, /^[0-9a-f]{64}$/);
    assert.match(entry.ats_pdf, /^https:\/\/coder058\.github\.io\/profile\/assets\//);
  }
});

test('project content stays visible without an animation callback', () => {
  const css = readFileSync(new URL('../application-ready.css', import.meta.url), 'utf8');
  const script = readFileSync(new URL('../motion.js', import.meta.url), 'utf8');
  assert.match(css, /\.reveal\{opacity:1;transform:none\}/);
  assert.doesNotMatch(script, /IntersectionObserver/);
  assert.match(css, /\.project-copy>p:not\(\.project-index\)\{font-size:1\.0625rem/);
});
