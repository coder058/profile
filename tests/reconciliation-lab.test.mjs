import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = new URL('../projects/reconciliation/', import.meta.url);
const read = name => readFileSync(new URL(name, base), 'utf8');

test('public lab source and output stay explicitly synthetic and fingerprinted', () => {
  const page = read('index.html');
  const input = JSON.parse(read('input.json'));
  const report = JSON.parse(read('report.json'));
  assert.equal(input.provenance, 'synthetic');
  assert.equal(report.provenance, 'synthetic');
  assert.equal(input.dataset, report.dataset);
  for (const file of ['input.json', 'report.json']) {
    assert.ok(page.includes(createHash('sha256').update(read(file)).digest('hex')));
  }
  assert.match(page, /not the historical bot or its real account data/);
  assert.match(page, /this page is a static export/);
  assert.match(page, /does not connect to a hosted database/);
  assert.match(page, /not independent proof of a trade/);
});

test('each computed order and issue appears in the rendered evidence table', () => {
  const page = read('index.html'), report = JSON.parse(read('report.json'));
  assert.equal((page.match(/<tr data-state=/g) || []).length, report.orders.length);
  for (const row of report.orders) {
    assert.ok(page.includes('<td>' + row.order_id + '</td>'));
    for (const issue of row.issues) assert.ok(page.includes(issue));
  }
  assert.ok(report.orders.some(row => row.state === 'unconfirmed'));
  assert.ok(report.unattributed_fills.length > 0);
  assert.match(read('filters.js'), /row.hidden/);
});
