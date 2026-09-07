import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('selected projects are single-link cards with current names', () => {
  for (const name of ['Relay', 'Pattern Forge', 'Python trading bot']) assert.ok(html.includes(`<h3>${name}</h3>`));
  assert.doesNotMatch(html, /<h3>DispatchOps<\/h3>|<h3>Transcript Desk<\/h3>|Source &amp; tests|OPEN WORK|project-index/);
  // SOURCE: user's September review removes the game from featured work.
  assert.equal((html.match(/class="project-card /g) || []).length, 3);
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
  assert.match(html, /<p class="hero-summary">Market-data interfaces, HTTP APIs and small developer tools/);
  assert.doesNotMatch(html, /Software developer in Amsterdam/);
  assert.doesNotMatch(html, /Full-stack developer/i);
  assert.doesNotMatch(html, /I’m curious about how things work/);
  assert.doesNotMatch(html, /coding agents to explore possible answers/);
  assert.doesNotMatch(html, /open to relocation|Python, TypeScript (?:&amp;|and) SQL/i);
  // SOURCE: recruiter review 6 Sep 2026 — Pattern Forge is the main demo.
  assert.ok(html.indexOf('<h3>Pattern Forge</h3>') < html.indexOf('<h3>Relay</h3>'));
  assert.ok(html.indexOf('<h3>Relay</h3>') < html.indexOf('<h3>Python trading bot</h3>'));
  assert.doesNotMatch(html, /id="about"|about-title|about-copy|about-note/);
});

test('a reader can scan the stack and the evidence behind each project', () => {
  for (const tool of ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'])
    assert.ok(html.includes(`<li>${tool}</li>`), tool);
  // SOURCE: counts and deployment checks recorded in the 5-6 September project audits.
  assert.equal((html.match(/class="project-proof"/g) || []).length, 3);
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
  assert.equal((html.match(/class="project-data"/g) || []).length, 3);
  for (const slug of ['polybow', 'pattern-forge', 'relay']) {
    assert.ok(html.includes(`href="projects/${slug}.html#data"`), slug);
  }
});

test('Le Wagon labs sit in a More challenges window, not featured cards', () => {
  assert.doesNotMatch(html, />Challenges</);
  assert.match(html, /<h2 id="challenges-title">More challenges<\/h2>/);
  assert.match(html, /class="challenges-window"/);
  assert.doesNotMatch(html, /Other projects|DispatchOps|Transcript Desk|City Gardens|not sole-authored|Selected course exercises/);
  assert.match(html, /API labs/);
  assert.match(html, /js-geocoder/);
  assert.match(html, /rails-task-manager/);
  assert.match(html, /rails-wikinimous/);
  assert.doesNotMatch(html, /unfinished scaffold/);
  assert.doesNotMatch(html, /200 challenges|every Le Wagon Kitt challenge was completed/i);
  assert.doesNotMatch(html, /lewagon-api-lab/);
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="more-challenges"'));
  assert.equal((html.match(/class="project-card /g) || []).length, 3);
});

test('project content stays visible without an animation callback', () => {
  const css = readFileSync(new URL('../application-ready.css', import.meta.url), 'utf8');
  const script = readFileSync(new URL('../motion.js', import.meta.url), 'utf8');
  assert.match(css, /\.reveal\{opacity:1;transform:none\}/);
  assert.doesNotMatch(script, /IntersectionObserver/);
  assert.match(css, /\.project-copy>p:not\(\.project-index\)\{font-size:1\.0625rem/);
});
