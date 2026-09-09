import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('one public blog lists the notes, old journal indexes redirect', () => {
  for (const path of [
    '../blog/index.html',
    '../tape/index.html',
    '../tape/wti-is-not-spot.html',
    '../host/index.html',
    '../host/dublin-instance.html',
    '../assets/journal.css'
  ]) {
    assert.ok(existsSync(new URL(path, import.meta.url)), path);
  }
  const blog = readFileSync(new URL('../blog/index.html', import.meta.url), 'utf8');
  const tapeIndex = readFileSync(new URL('../tape/index.html', import.meta.url), 'utf8');
  const hostIndex = readFileSync(new URL('../host/index.html', import.meta.url), 'utf8');
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(blog, /Weekly analysis of financial markets/);
  assert.match(blog, /Week 1 — Wallet open at \$19\.98/);
  assert.match(blog, /Week 14 — WTI is not spot oil/);
  assert.match(blog, /16 Apr 2026/);
  assert.match(blog, /wallet-started.html/);
  assert.match(blog, /leftover-ask-gone.html/);
  assert.match(blog, /one-hundred-million.html/);
  assert.match(blog, /hyperliquid-not-a-bot.html/);
  assert.match(blog, /dublin-instance.html/);
  assert.ok(blog.indexOf('wallet-started.html') < blog.indexOf('wti-is-not-spot.html'));
  assert.doesNotMatch(blog, /hiring manager|how I looked|I lost money|energy recordings|machines that held/);
  assert.doesNotMatch(blog, /Amplify Trading recommended|Conclusion I will defend|“TAPE”|“HOST”/);
  assert.match(tapeIndex, /url=\.\.\/blog\//);
  assert.match(hostIndex, /url=\.\.\/blog\//);
  assert.match(home, /href="blog\/"/);
  assert.doesNotMatch(home, /href="tape\/"|href="host\/"/);
});

test('energy post is a recording, not a spot forecast', () => {
  const html = readFileSync(new URL('../tape/wti-is-not-spot.html', import.meta.url), 'utf8');
  assert.match(html, /06 September 2026/);
  assert.match(html, /Polymarket Perps/);
  assert.match(html, /2,482/);
  assert.match(html, /not a forecast/i);
  assert.doesNotMatch(html, /buy oil|price target|guaranteed/i);
  assert.match(html, /href="\.\.\/blog\/"/);
  assert.doesNotMatch(html, /“TAPE”|“HOST”/);
});

// SOURCE: recomputed from pattern-forge/public/recordings/WTIOILUSD.json on 10 Sep 2026 —
// 2,482 unique hourly timestamps, 42 interruptions, 76 absent hourly bars, worst gap 9 hours.
// A count of gaps is not a count of missing hours.
test('the WTI posts separate the number of gaps from the missing hours', () => {
  for (const path of ['../tape/wti-is-not-spot.html', '../host/cloud-parquet.html']) {
    const html = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.match(html, /42 gaps covering 76 missing hourly bars/, path);
    assert.doesNotMatch(html, /42 missing hours|42 hours, left empty/, path);
  }
});

test('blog notes do not brand the bot as Polybow', () => {
  const walkthrough = readFileSync(new URL('../projects/polybow.html', import.meta.url), 'utf8');
  assert.match(walkthrough, /Python trading bot/);
  assert.doesNotMatch(walkthrough, /<h1>Polybow<\/h1>/);
});

test('host post measures prepare plus POST, not a fill', () => {
  const html = readFileSync(new URL('../host/dublin-instance.html', import.meta.url), 'utf8');
  assert.match(html, /Lightsail/);
  assert.match(html, /eu-west-1/);
  assert.match(html, /35\.35 ms/);
  assert.match(html, /not a fill/i);
  assert.doesNotMatch(html, /profitable strategy|durable edge/i);
});
