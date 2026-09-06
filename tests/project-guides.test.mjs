import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projects } from '../projects/content.mjs';

test('each project has a rendered journey, dependencies, contribution and limits', () => {
  for (const project of projects) {
    const html = readFileSync(new URL(`../projects/${project.slug}.html`, import.meta.url),'utf8');
    assert.ok(html.includes(project.name));
    for (const text of ['My contribution','What depends on what','Implementation, step by step','Limits and unfinished work']) assert.ok(html.includes(text));
    assert.ok(html.includes('<table>'));
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

test('Polybow leads with the leftover-ask problem, not a balance chart', () => {
  const html = readFileSync(new URL('../projects/polybow.html', import.meta.url), 'utf8');
  assert.match(html, /leftover cheap ask|last-second cheap asks/);
  assert.match(html, /AWS Lightsail/);
  assert.match(html, /ws_books_YYYYMMDD.jsonl/);
  assert.match(html, /How the data was organised/);
  assert.match(html, /Skills this work used/);
  assert.doesNotMatch(html, /\$18|\$220|converted a account/i);
  assert.doesNotMatch(html, /StratD/);
});
