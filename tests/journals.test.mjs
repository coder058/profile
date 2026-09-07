import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('two public journals exist with today’s first posts', () => {
  for (const path of [
    '../tape/index.html',
    '../tape/wti-is-not-spot.html',
    '../host/index.html',
    '../host/dublin-instance.html',
    '../assets/journal.css'
  ]) {
    assert.ok(existsSync(new URL(path, import.meta.url)), path);
  }
});

test('energy post is a recording, not a spot forecast', () => {
  const html = readFileSync(new URL('../tape/wti-is-not-spot.html', import.meta.url), 'utf8');
  assert.match(html, /06 September 2026/);
  assert.match(html, /Polymarket Perps/);
  assert.match(html, /2,482/);
  assert.match(html, /not a forecast/i);
  assert.doesNotMatch(html, /buy oil|price target|guaranteed/i);
});

test('journal archive is dated from April and does not brand the bot as Polybow', () => {
  const tape = readFileSync(new URL('../tape/index.html', import.meta.url), 'utf8');
  const host = readFileSync(new URL('../host/index.html', import.meta.url), 'utf8');
  const walkthrough = readFileSync(new URL('../projects/polybow.html', import.meta.url), 'utf8');
  assert.match(tape, /16 Apr 2026/);
  assert.match(tape, /wallet-started.html/);
  assert.match(tape, /leftover-ask-gone.html/);
  assert.doesNotMatch(tape, /Amplify Trading recommended|Conclusion I will defend/);
  assert.doesNotMatch(host, /assembled here later|Conclusion I will defend/);
  assert.match(host, /one-hundred-million.html/);
  assert.match(host, /hyperliquid-not-a-bot.html/);
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
