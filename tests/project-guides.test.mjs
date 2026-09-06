import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { projects } from '../projects/content.mjs';

test('each project has a rendered journey, dependencies, contribution and limits', () => {
  for (const project of projects) {
    const html = readFileSync(new URL(`../projects/${project.slug}.html`, import.meta.url),'utf8');
    assert.ok(html.includes(project.name));
    for (const text of ['My contribution','Implementation, step by step','Limits and unfinished work']) assert.ok(html.includes(text));
    assert.ok(html.includes('What depends on what') || html.includes('How the data was organised'));
    assert.ok(html.includes('<table>'));
    assert.ok(html.includes('id="data"'));
    assert.match(html, /How the data was organised/);
    assert.ok(html.includes('scope="col"'));
    assert.ok(html.includes(project.code));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
  }
});
test('cards lead to readable project guides, without adding a fourth selected project', () => {
  const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for (const slug of ['polybow','pattern-forge','relay']) assert.ok(html.includes(`href="projects/${slug}.html"`));
  assert.ok(!html.includes('<h3>City Gardens</h3>'));
});

test('Polybow walkthrough separates StratA prices from the early expensive tickets', () => {
  const html = readFileSync(new URL('../projects/polybow.html', import.meta.url), 'utf8');
  assert.match(html, /leftover cheap ask|last-second cheap asks/);
  assert.match(html, /\$0\.40–\$0\.72|\$0.40–\$0.72/);
  assert.match(html, /AWS Lightsail/);
  assert.match(html, /ws_books_YYYYMMDD.jsonl/);
  assert.match(html, /How the data was organised/);
  assert.match(html, /Skills this work used/);
  assert.match(html, /Read the case study/);
  assert.doesNotMatch(html, /\$18|\$220|converted a account/i);
  assert.doesNotMatch(html, /StratD/);
  assert.doesNotMatch(html, /Early Polybow, StratA and StratB bought expensive/);
});

test('Relay and Pattern Forge walkthroughs include a skills table', () => {
  for (const slug of ['relay', 'pattern-forge']) {
    const html = readFileSync(new URL(`../projects/${slug}.html`, import.meta.url), 'utf8');
    assert.match(html, /Skills this work used/);
  }
});

test('résumé page offers one designed PDF and one ATS PDF', () => {
  const html = readFileSync(new URL('../resume.html', import.meta.url), 'utf8');
  assert.match(html, /<h1>Résumé<\/h1>/);
  assert.match(html, /assets\/jordi-lluis-cv\.pdf/);
  assert.match(html, /assets\/jordi-lluis-cv-ats\.pdf/);
  assert.doesNotMatch(html, /volume pack|scientist-light|apply-pack\.json|FDE-shaped/i);
  assert.ok(existsSync(new URL('../assets/jordi-lluis-cv.pdf', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/jordi-lluis-cv-ats.pdf', import.meta.url)));
  const pack = JSON.parse(readFileSync(new URL('../apply-pack.json', import.meta.url), 'utf8'));
  assert.equal(pack.ready_to_apply, true);
  assert.deepEqual(pack.packs.map((item) => item.id), ['fullstack', 'ai', 'data', 'software', 'fde']);
  for (const [, target] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    assert.ok(existsSync(new URL('../' + target.split('?')[0], import.meta.url)), target);
  }
});
