import { writeFileSync } from 'node:fs';
import { projects } from '../projects/content.mjs';
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const list = items => `<ol>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`;
const paragraphs = value => (Array.isArray(value) ? value : [value]).filter(Boolean).map(item => `<p>${esc(item)}</p>`).join('');
const table = (caption, headers, rows, label) =>
  `<div class="table-scroll" tabindex="0" role="region" aria-label="${esc(label)}"><table><caption>${esc(caption)}</caption><thead><tr>${headers.map(header=>`<th scope="col">${esc(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,index)=>index===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
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
<body><a class="skip" href="#project">Skip to project</a><header><a href="${home}">← Jordi Lluis / ${esc(homeLabel)}</a></header>
<main id="project"><h1>${esc(project.name)}</h1><p class="lead">${esc(project.summary)}</p><p>${esc(project.stack)}</p>
<nav aria-label="Project links">${project.demo ? `<a href="${project.demo}">Try ${esc(project.name)} ↗</a>` : ''}<a href="${project.code}">Read the code ↗</a><a href="${dataHref}">How the data was organised</a></nav>
<section><h2>The problem</h2>${paragraphs(project.problem)}<h2>My contribution</h2>${paragraphs(project.contribution)}</section>
${project.skills ? `<section><h2>Skills this work used</h2>${table('Tools and what they did in this project', ['Skill','Where it was used'], project.skills, 'Skills used in this project')}</section>` : ''}
<section><h2>${project.demo ? 'Try it step by step' : 'The intended user journey'}</h2>${list(project.steps)}</section>
<section id="${dependsId}"><h2>${esc(dependsTitle)}</h2>${table(dependsCaption, ['Component','Depends on','Responsibility'], project.dependencies, 'Project dependency table')}</section>
${project.records ? `<section id="data"><h2>${esc(project.recordsTitle || 'How the data was organised')}</h2>${paragraphs(project.recordsIntro || '')}${table(project.recordsCaption || 'Tables, files and keys', ['Record','Depends on','Responsibility'], project.records, 'Data organisation table')}</section>` : ''}
<section><h2>Implementation, step by step</h2>${list(project.build)}${project.run?`<h3>Run the public code locally</h3><pre><code>${esc(project.run)}</code></pre><p>Use the repository README for environment setup and supported versions.</p>`:''}</section>
<section><h2>Limits and unfinished work</h2>${paragraphs(project.limits)}${project.references?`<p>${project.references.map(([label,url])=>`<a href="${url}">${esc(label)}</a>`).join(' · ')}</p>`:''}</section>
</main><footer><a href="${home}">Back to ${esc(homeLabel.toLowerCase())}</a></footer></body></html>`;
  writeFileSync(new URL(`../projects/${project.slug}.html`, import.meta.url), html);
}
