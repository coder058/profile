import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('selected projects are single-link cards with current names', () => {
  for (const name of ['Relay', 'Pattern Forge', 'Polybow', 'DispatchOps']) assert.ok(html.includes(`<h3>${name}</h3>`));
  assert.doesNotMatch(html, /Transcript Desk|Source &amp; tests|OPEN WORK|project-index/);
  // SOURCE: the reviewed portfolio has four selected project cards.
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
  assert.match(html, /Full-stack developer/);
  assert.match(html, /I’m curious about how things work/);
  assert.match(html, /coding agents to explore possible answers/);
  assert.doesNotMatch(html, /open to relocation|Python, TypeScript (?:&amp;|and) SQL/i);
  assert.ok(html.indexOf('<h3>Polybow</h3>') < html.indexOf('<h3>Relay</h3>'));
});
