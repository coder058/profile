import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('selected projects have direct source links and current names', () => {
  for (const slug of ['relay', 'transcript-desk', 'pattern-forge', 'polybow-case-study']) {
    assert.ok(html.includes(`https://github.com/coder058/${slug}"`));
  }
  for (const name of ['Relay', 'Transcript Desk', 'Pattern Forge', 'Polybow']) assert.ok(html.includes(`<h3>${name}</h3>`));
  assert.doesNotMatch(html, /Operational Tools|<h3>Hyperliquid<|Video AI Digest/);
  // SOURCE: the reviewed portfolio has four selected project cards.
  assert.equal((html.match(/class="project-card /g) || []).length, 4);
  assert.ok(html.includes('rel="canonical" href="https://coder058.github.io/profile/"'));
});
test('local styles, scripts, images and resume exist', () => {
  for (const [, target] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    assert.ok(existsSync(new URL('../' + target.split('?')[0], import.meta.url)), target);
  }
});
