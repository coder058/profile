import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { projects } from '../projects/content.mjs';

test('each project renders its declared evidence sections', () => {
  for (const project of projects) {
    const html = readFileSync(new URL(`../projects/${project.slug}.html`, import.meta.url),'utf8');
    assert.ok(html.includes(project.name));
    assert.ok(html.includes('My contribution'));
    if (project.build?.length) assert.ok(html.includes('Implementation, step by step'));
    if (project.limits) assert.ok(html.includes('Limits and unfinished work'));
    assert.ok(html.includes(project.dependsTitle || 'What depends on what'));
    assert.ok(html.includes('<table>') || html.includes('class="schema-map'));
    assert.ok(html.includes('id="data"'));
    if (!project.recordMap) assert.ok(html.includes('scope="col"'));
    if (!project.hideNav && project.code) assert.ok(html.includes(project.code));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
  }
});
test('cards distinguish interactive demos, recorded cases and external review', () => {
  const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html, /href="https:\/\/pattern-forge-five\.vercel\.app\/"/);
  assert.match(html, /href="projects\/polybow\.html"/);
  assert.match(html, /href="https:\/\/energy-monitor-jordi.jlpmccs.chatgpt.site\/"/);
  assert.match(html, /href="https:\/\/coder058\.github\.io\/info-desk\/"/);
  assert.match(html, /href="projects\/polybow\.html#depends"/);
  for (const slug of ['pattern-forge','info-desk']) assert.ok(html.includes(`href="projects/${slug}.html#data"`));
  assert.ok(!html.includes('<h3>City Gardens</h3>'));
});

test('Python trading bot case leads with the operated system and ends with separate synthetic work', () => {
  const html = readFileSync(new URL('../projects/polybow.html', import.meta.url), 'utf8');
  assert.match(html, /The real problem/);
  assert.match(html, /leftover asks|very cheap ask/);
  assert.match(html, /\$0\.40–\$0\.72|\$0.40–\$0.72/);
  assert.match(html, /AWS Lightsail/);
  assert.match(html, /ws_books_YYYYMMDD.jsonl/);
  assert.match(html, /How the data connects/);
  assert.match(html, /class="schema-map/);
  assert.match(html, /Why the opportunity stopped working/);
  assert.match(html, /12,929 markets/);
  assert.match(html, /104\.5 million/);
  assert.match(html, /cannot isolate one patch/);
  assert.match(html, /Hyperliquid public market data/);
  assert.match(html, /polymarket\.com\/profile\/0x0022C02Dda115a6E0307007881a6e19394883DB0/);
  assert.match(html, /market_ledger\.csv/);
  assert.match(html, /Open the separate technical lab/);
  assert.ok(html.indexOf('Inspect the real public activity') < html.indexOf('Reconciliation lab'));
  for (const removed of ['Skills this work used', 'Try it step by step', 'Implementation, step by step', 'Run the public code locally', 'Limits and unfinished work', 'Python · WebSockets · AWS Lightsail']) assert.ok(!html.includes(removed), removed);
  assert.doesNotMatch(html, /\$18|\$220|converted a account/i);
  assert.doesNotMatch(html, /StratD/);
  assert.doesNotMatch(html, /Early Polybow, StratA and StratB bought expensive/);
  assert.match(html, /Python trading bot/);
  assert.doesNotMatch(html, /<h1>Polybow<\/h1>/);
});

test('Relay walkthrough is an evidence desk, not a job-search product', () => {
  const html = readFileSync(new URL('../projects/relay.html', import.meta.url), 'utf8');
  assert.match(html, /not a job-search product/);
  assert.match(html, /Paste a public job description/);
  assert.match(html, /not a hiring score/);
});

test('Relay and Pattern Forge walkthroughs include a skills table', () => {
  for (const slug of ['relay', 'pattern-forge', 'info-desk']) {
    const html = readFileSync(new URL(`../projects/${slug}.html`, import.meta.url), 'utf8');
    assert.match(html, /Skills this work used/);
  }
});

test('résumé page shows the one-page CV', () => {
  const html = readFileSync(new URL('../resume.html', import.meta.url), 'utf8');
  const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<h1>Jordi Lluis<\/h1>/);
  assert.match(html, /assets\/jordi-lluis-cv\.png/);
  assert.match(html, /<figure class="resume-sheet">/);
  assert.match(html, /assets\/jordi-lluis-cv\.pdf/);
  assert.match(html, /assets\/jordi-lluis-cv-ats\.pdf/);
  assert.match(index, /href="resume\.html\?v=cv"/);
  assert.doesNotMatch(html, /One page\. The designed file|volume pack|scientist-light|apply-pack\.json|FDE-shaped/i);
  assert.ok(existsSync(new URL('../assets/jordi-lluis-cv.pdf', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/jordi-lluis-cv.png', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/jordi-lluis-cv-ats.pdf', import.meta.url)));
  const pack = JSON.parse(readFileSync(new URL('../apply-pack.json', import.meta.url), 'utf8'));
  assert.deepEqual(pack.packs.map((item) => item.id), ['software', 'data']);
  for (const [, target] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    assert.ok(existsSync(new URL('../' + target.split('?')[0], import.meta.url)), target);
  }
});
