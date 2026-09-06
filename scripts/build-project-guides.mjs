import { writeFileSync } from 'node:fs';
import { projects } from '../projects/content.mjs';
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const list = items => `<ol>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`;
for (const project of projects) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(project.name)} — Jordi Lluis</title><meta name="description" content="${esc(project.summary)}">
<link rel="canonical" href="https://coder058.github.io/profile/projects/${project.slug}.html"><link rel="stylesheet" href="guide.css"></head>
<body><a class="skip" href="#project">Skip to project</a><header><a href="../index.html#work">← Jordi Lluis / Projects</a></header>
<main id="project"><h1>${esc(project.name)}</h1><p class="lead">${esc(project.summary)}</p><p>${esc(project.stack)}</p>
<nav aria-label="Project links">${project.demo ? `<a href="${project.demo}">Try ${esc(project.name)} ↗</a>` : ''}<a href="${project.code}">Read the code ↗</a></nav>
<section><h2>The problem</h2><p>${esc(project.problem)}</p><h2>My contribution</h2><p>${esc(project.contribution)}</p></section>
<section><h2>${project.demo ? 'Try it step by step' : 'The intended user journey'}</h2>${list(project.steps)}</section>
<section><h2>What depends on what</h2><div class="table-scroll" tabindex="0" role="region" aria-label="Project dependency table"><table><caption>Components, dependencies and responsibility</caption><thead><tr><th scope="col">Component</th><th scope="col">Depends on</th><th scope="col">Responsibility</th></tr></thead><tbody>${project.dependencies.map(row=>`<tr>${row.map((cell,index)=>index===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
<section><h2>Implementation, step by step</h2>${list(project.build)}${project.run?`<h3>Run the public code locally</h3><pre><code>${esc(project.run)}</code></pre><p>Use the repository README for environment setup and supported versions.</p>`:''}</section>
<section><h2>Limits and unfinished work</h2><p>${esc(project.limits)}</p>${project.references?`<p>${project.references.map(([label,url])=>`<a href="${url}">${esc(label)}</a>`).join(' · ')}</p>`:''}</section>
</main><footer><a href="../index.html#work">Back to selected projects</a></footer></body></html>`;
  writeFileSync(new URL(`../projects/${project.slug}.html`, import.meta.url), html);
}
