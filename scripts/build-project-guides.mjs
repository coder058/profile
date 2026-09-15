import { writeFileSync } from 'node:fs';
import { projects } from '../projects/content.mjs';
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const list = items => `<ol>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`;
const paragraphs = value => (Array.isArray(value) ? value : [value]).filter(Boolean).map(item => `<p>${esc(item)}</p>`).join('');
const table = (caption, headers, rows, label) =>
  `<div class="table-scroll" tabindex="0" role="region" aria-label="${esc(label)}"><table><caption>${esc(caption)}</caption><thead><tr>${headers.map(header=>`<th scope="col">${esc(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,index)=>index===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const versionCards = rows => `<div class="version-grid">${rows.map(([name, entry, change], index) => `<article class="version-card"><p class="map-index">${String(index + 1).padStart(2, '0')}</p><h3>${esc(name)}</h3><dl><div><dt>Entry</dt><dd>${esc(entry)}</dd></div><div><dt>Engineering change</dt><dd>${esc(change)}</dd></div></dl></article>`).join('')}</div>`;
const schemaMap = (rows, label, className = '') => `<div class="schema-map ${className}" role="list" aria-label="${esc(label)}">${rows.map(([name, dependsOn, responsibility], index) => `<article class="schema-card" role="listitem"><header><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(name)}</h3></header><dl><div><dt>Reads from</dt><dd>${esc(dependsOn)}</dd></div><div><dt>Produces</dt><dd>${esc(responsibility)}</dd></div></dl></article>`).join('')}</div>`;
const accountLinks = links => `<div class="account-grid">${links.map(([label, url, detail]) => `<a class="account-link" href="${esc(url)}"><span>${esc(label)}</span><strong>Open public record ↗</strong><small>${esc(detail)}</small></a>`).join('')}</div>`;
for (const project of projects) {
  const home = project.home || '../index.html#work';
  const homeLabel = project.home ? 'More challenges' : 'Projects';
  const dataHref = '#data';
  const dependsTitle = project.dependsTitle || 'What depends on what';
  const dependsCaption = project.dependsCaption || 'Components, dependencies and responsibility';
  const dependsId = project.records ? 'depends' : 'data';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(project.name)} — Jordi Lluis</title><meta name="description" content="${esc(project.summary)}">
<link rel="canonical" href="https://coder058.github.io/profile/projects/${project.slug}.html"><link rel="stylesheet" href="guide.css"></head>
<body${project.pageClass ? ` class="${esc(project.pageClass)}"` : ''}><a class="skip" href="#project">Skip to project</a><header><a href="${home}">← Jordi Lluis / ${esc(homeLabel)}</a></header>
<main id="project"><div class="project-hero"><h1>${esc(project.name)}</h1><p class="lead">${esc(project.summary)}</p>${project.stack ? `<p>${esc(project.stack)}</p>` : ''}</div>
${project.hideNav ? '' : `<nav aria-label="Project links">${project.demo ? `<a href="${project.demo}">${esc(project.demoLabel || `Try ${project.name}`)} ↗</a>` : ''}${project.code ? `<a href="${project.code}">Read the code ↗</a>` : ''}<a href="${dataHref}">How the data was organised</a></nav>`}
${project.featuredStory ? `<section class="problem-section" id="problem"><p class="section-index">01 / Problem</p><h2>The real problem</h2><div class="problem-copy">${paragraphs(project.problem)}</div></section>${project.branches ? `<section id="versions"><p class="section-index">02 / Iterations</p><h2>Four versions, one evolving system</h2>${versionCards(project.branches)}</section>` : ''}<section id="contribution"><p class="section-index">03 / Ownership</p><h2>My contribution</h2><div class="contribution-copy">${paragraphs(project.contribution)}</div></section>` : `<section><h2>The problem</h2>${paragraphs(project.problem)}${project.branches ? `<h2>Versions</h2>${table('Entry price and timing by branch', ['Branch','Entry','What changed'], project.branches, 'Strategy branches')}` : ''}<h2>My contribution</h2>${paragraphs(project.contribution)}</section>`}
${project.skills ? `<section><h2>Skills this work used</h2>${table('Tools and what they did in this project', ['Skill','Where it was used'], project.skills, 'Skills used in this project')}</section>` : ''}
${project.steps?.length ? `<section><h2>${project.demo ? 'Try it step by step' : 'The intended user journey'}</h2>${list(project.steps)}</section>` : ''}
<section id="${dependsId}"${project.dependencyMap ? ' class="map-section"' : ''}>${project.featuredStory ? '<p class="section-index">04 / Architecture</p>' : ''}<h2>${esc(dependsTitle)}</h2>${project.dependenciesIntro ? paragraphs(project.dependenciesIntro) : ''}${project.dependencyMap ? schemaMap(project.dependencies, 'System architecture map') : table(dependsCaption, ['Component','Depends on','Responsibility'], project.dependencies, 'Project dependency table')}</section>
${project.records ? `<section id="data"${project.recordMap ? ' class="map-section data-section"' : ''}>${project.featuredStory ? '<p class="section-index">05 / Data model</p>' : ''}<h2>${esc(project.recordsTitle || 'How the data was organised')}</h2>${paragraphs(project.recordsIntro || '')}${project.recordMap ? schemaMap(project.records, 'Data organisation map', 'data-map') : table(project.recordsCaption || 'Tables, files and keys', ['Record','Depends on','Responsibility'], project.records, 'Data organisation table')}</section>` : ''}
${project.build?.length ? `<section><h2>Implementation, step by step</h2>${list(project.build)}${project.run?`<h3>Run the public code locally</h3><pre><code>${esc(project.run)}</code></pre><p>Use the repository README for environment setup and supported versions.</p>`:''}</section>` : ''}
${project.ending ? `<section class="ending-section"><p class="section-index">06 / Postmortem</p><h2>${esc(project.endingTitle || 'What changed')}</h2>${paragraphs(project.ending)}</section>` : `<section><h2>Limits and unfinished work</h2>${paragraphs(project.limits)}${project.references?`<p>${project.references.map(([label,url])=>`<a href="${url}">${esc(label)}</a>`).join(' · ')}</p>`:''}</section>`}
${project.accountLinks ? `<section class="account-section"><p class="section-index">07 / Evidence</p><h2>${esc(project.accountTitle || 'Public activity')}</h2>${paragraphs(project.accountIntro || '')}${accountLinks(project.accountLinks)}</section>` : ''}
${project.labCoda ? `<aside class="lab-coda"><p class="section-index">Separate technical exercise</p><h2>${esc(project.labCoda.title)}</h2>${paragraphs(project.labCoda.text)}<a href="${esc(project.labCoda.url)}">${esc(project.labCoda.label)} ↗</a></aside>` : ''}
</main><footer><a href="${home}">Back to ${esc(homeLabel.toLowerCase())}</a></footer></body></html>`;
  writeFileSync(new URL(`../projects/${project.slug}.html`, import.meta.url), html);
}
