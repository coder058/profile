import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('selected projects are single-link cards with current names', () => {
  for (const name of ['Relay', 'Pattern Forge', 'Polybow']) assert.ok(html.includes(`<h3>${name}</h3>`));
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
  assert.match(html, /Software developer in Amsterdam/);
  assert.doesNotMatch(html, /Full-stack developer/i);
  assert.match(html, /I’m curious about how things work/);
  assert.match(html, /coding agents to explore possible answers/);
  assert.doesNotMatch(html, /open to relocation|Python, TypeScript (?:&amp;|and) SQL/i);
  // SOURCE: recruiter review 6 Sep 2026 — Pattern Forge is the main demo.
  assert.ok(html.indexOf('<h3>Pattern Forge</h3>') < html.indexOf('<h3>Relay</h3>'));
  assert.ok(html.indexOf('<h3>Relay</h3>') < html.indexOf('<h3>Polybow</h3>'));
  assert.match(html, /<h2 id="about-title">About<\/h2>/);
});

test('a reader can scan the stack and the evidence behind each project', () => {
  for (const tool of ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'])
    assert.ok(html.includes(`<li>${tool}</li>`), tool);
  // SOURCE: counts and deployment checks recorded in the 5-6 September project audits.
  assert.equal((html.match(/class="project-proof"/g) || []).length, 3);
  assert.match(html, /Tests, Docker image and PostgreSQL restart checked in CI/);
  assert.match(html, /pytest in CI · one review service behind HTTP and MCP/);
  assert.match(html, /Lightsail · WebSockets · JSONL recordings/);
  assert.equal((html.match(/class="project-data"/g) || []).length, 3);
  for (const slug of ['polybow', 'pattern-forge', 'relay']) {
    assert.ok(html.includes(`href="projects/${slug}.html#data"`), slug);
  }
});

test('Le Wagon and other GitHub work sits in More challenges, not featured cards', () => {
  assert.ok(html.includes('href="#more-challenges"'));
  assert.match(html, /<h2 id="challenges-title">More challenges<\/h2>/);
  assert.match(html, /City Gardens/);
  assert.match(html, /API labs/);
  assert.match(html, /not sole-authored/);
  assert.match(html, /DispatchOps/);
  assert.match(html, /Transcript Desk/);
  assert.match(html, /js-geocoder/);
  assert.match(html, /rails-task-manager/);
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
