import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const html = read('index.html');

test('featured selection leads with independent Polybow and includes external review', () => {
  const titles = [...html.matchAll(/<article class="project-card[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(x => x[1]);
  assert.deepEqual(titles, ['Fly Brain', 'Polybow', 'Pattern Forge', 'Info Desk', 'Haystack']);
  assert.match(html, /Independent projects\s*<span>&amp; open source<\/span>/);
  assert.match(html, /href="https:\/\/github.com\/deepset-ai\/haystack\/pull\/12635"/);
  assert.match(html, /href="projects\/fly-brain\.html"/);
  assert.doesNotMatch(html, /relay-ten-zeta|<h3>DispatchOps|enterprise customer|years of professional/);
});

test('local assets and fragment destinations resolve', () => {
  for (const page of ['index.html', 'resume.html']) {
    for (const [, target] of read(page).matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:)/.test(target)) continue;
      const [pathname, anchor] = target.split('#');
      const file = pathname.split('?')[0] || page;
      const resolved = file.endsWith('/') ? file + 'index.html' : file;
      assert.ok(existsSync(new URL('../' + resolved, import.meta.url)), target);
      if (anchor) assert.ok(read(resolved).includes('id="' + anchor + '"'), target);
    }
  }
});

test('hero names the person, the AI brief, and Amsterdam', () => {
  assert.match(html, /<p class="career-name">Jordi Lluis<\/p>/);
  assert.match(html, /Take a step back/);
  assert.match(html, /AI is not just a model/);
  assert.match(html, /First of all, the model is a start/);
  assert.match(html, /The reason for that is simple/);
  assert.match(html, /I still go back to the data/);
  assert.match(html, /AMSTERDAM/);
  assert.match(html, />Work<\/a>/);
  assert.match(html, />Resume<\/a>/);
  assert.match(html, /what did the system actually know/);
  assert.doesNotMatch(html, /Engineering work|Résumé|Software Engineer|replaying what was known|Code\. Decisions\. Evidence|Explore the engineering|Get in touch|Using agentic AI|Domain-specific agents|My logistics work|It is a system sitting on the data/);
  assert.doesNotMatch(html, /I like tackling everyday problems|Full-stack developer|AI engineer/);
  for (const tool of ['Ruby on Rails', 'Python', 'PostgreSQL', 'JavaScript', 'React', 'Docker', 'AWS VPS', 'FastAPI', 'Git', 'HTML / CSS', 'MCP', 'Retrieval + evals', 'WebSockets']) {
    assert.match(html, new RegExp('<li class="[^"]*">' + tool.replace(/[+]/g, '\\+') + '<\\/li>'));
  }
  assert.doesNotMatch(html, /Recorded cases are labelled; source and checks are linked/);
});

test('demo and historical evidence boundaries stay explicit', () => {
  assert.match(html, /An acknowledgement is not a fill/);
  assert.match(html, /Not proof of profitability/);
  assert.match(html, /The public demo does not serve that database/);
  assert.match(html, /recorded evidence case/);
  assert.match(html, /local live-research workspace/);
  assert.match(html, /cross-language misses/);
  assert.match(html, /public backend unavailable/);
  assert.match(html, /href="projects\/polybow\.html#depends"/);
  for (const slug of ['pattern-forge', 'info-desk']) assert.ok(html.includes('href="projects/' + slug + '.html#data"'));
});

test('Fly Brain leads the work grid and exposes progress without overclaiming', () => {
  const fly = read('projects/fly-brain.html');
  assert.ok(html.indexOf('href="projects/fly-brain.html"') < html.indexOf('href="projects/polybow.html"'));
  assert.match(fly, /The real problem/);
  assert.match(fly, /165122 neurons/);
  assert.match(fly, /25563197 edges/);
  assert.match(fly, /Research path, step by step/);
  assert.match(fly, /How the research architecture fits together/);
  assert.match(fly, /How the data and evidence connect/);
  assert.match(fly, /Architecture dependencies and responsibilities/);
  assert.match(fly, /Data records, dependencies and responsibilities/);
  assert.equal((fly.match(/<table>/g) || []).length, 2);
  assert.match(fly, /Component.*Depends on.*Responsibility/);
  assert.match(fly, /Record.*Depends on.*Responsibility/);
  assert.match(fly, /Progress is real\. The result is not finished/);
  assert.match(fly, /no eligible connectome\/DP delay/);
  assert.match(fly, /claim about biological intelligence/);
  assert.doesNotMatch(fly, /is a living-fly simulation|demonstrates biological intelligence|proves topology/);
});

test('earlier team work stays separate and private exercises are not linked', () => {
  assert.match(html, /Earlier team &amp; training work/);
  assert.match(html, /City Gardens \(team, 2023\)/);
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="more-challenges"'));
  assert.doesNotMatch(html, /js-geocoder|js-weather|lewagon-api-lab|200 challenges/);
});

test('resume offers both focused packs and keeps projects distinct from jobs', () => {
  const resume = read('resume.html');
  assert.match(resume, /class="resume-text"/);
  assert.match(resume, /ATS PDF \(text-selectable\)/);
  assert.match(resume, /Independent projects &amp; open source/);
  assert.match(resume, /Polybow - independent project, 2026/);
  assert.match(resume, /<h2>Experience<\/h2>/);
  assert.match(resume, /<h2>Education &amp; training<\/h2>/);
  assert.match(resume, /De Bommel/);
  assert.match(resume, /Haystack #12635/);
  assert.match(resume, /jordi-lluis-data-cv-ats.pdf/);
  assert.doesNotMatch(resume, /Further learning|Internal verification|professional software years/);
  assert.doesNotMatch(read('resume-packs.css'), /\.resume-text\{[^}]*display:none/);
});

test('public manifest is private-data-free and checksums match shipped files', () => {
  const raw = read('apply-pack.json'), pack = JSON.parse(raw);
  assert.deepEqual(pack.packs.map(x => x.id), ['software', 'data']);
  assert.equal(pack.default_pack, 'software');
  for (const leak of ['form_answers', 'how_to_submit', 'pack_selection', 'never_claim', 'salary', 'notice_period', 'C:\\\\Users', 'output/pdf']) assert.ok(!raw.includes(leak), leak);
  const hash = url => createHash('sha256').update(readFileSync(new URL('../assets/' + url.split('/').at(-1), import.meta.url))).digest('hex');
  for (const p of pack.packs) {
    assert.equal(hash(p.designed_pdf), p.sha256_designed);
    assert.equal(hash(p.ats_pdf), p.sha256_ats);
  }
  assert.equal(hash(pack.default_pdf.designed), pack.default_pdf.sha256_designed);
  assert.equal(hash(pack.default_pdf.ats), pack.default_pdf.sha256_ats);
});

test('content is visible without animations and keyboard focus has a visible outline', () => {
  assert.match(read('application-ready.css'), /\.reveal\{opacity:1;transform:none\}/);
  assert.doesNotMatch(read('motion.js'), /IntersectionObserver/);
  assert.match(read('career.css'), /a:focus-visible\{outline:/);
  assert.match(html, /class="skip-link"/);
  assert.equal((html.match(/<h1 /g) || []).length, 1); // SOURCE: one document heading.
});
