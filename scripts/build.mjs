import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const e = escapeHTML;
const list = values => `<ul>${values.map(value => `<li>${e(value)}</li>`).join('')}</ul>`;
const resourceLink = resource => `<a href="${e(resource.url)}">${e(resource.title)}</a>`;

export function validate(data) {
  const { shared, languages, tasks } = data;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(shared.updated)) throw new Error('Use an ISO editorial date.');
  for (const url of [shared.url, shared.repo, shared.discord, ...shared.resources.map(r => r.url)]) {
    if (new URL(url).protocol !== 'https:') throw new Error('Public links must use HTTPS.');
  }
  if (new Set(tasks.map(t => t.id)).size !== tasks.length) throw new Error('Task IDs must be unique.');
  const shape = value => value && typeof value === 'object'
    ? Object.keys(value).sort().map(key => `${key}:${shape(value[key])}`).join('|') : typeof value;
  if (shape(languages.es) !== shape(languages.en)) throw new Error('Language structures must match.');
  for (const task of tasks) {
    if (!/^[a-z0-9-]+$/.test(task.id) || ![60, 120].includes(task.minutes)) throw new Error(`Invalid task ${task.id}.`);
    if (!task.skills.length || task.skills.some(s => !languages.es.skills[s])) throw new Error(`Invalid skills: ${task.id}.`);
    if (task.sourceIds.some(id => !shared.resources.some(r => r.id === id))) throw new Error(`Unknown source: ${task.id}.`);
    for (const lang of ['es', 'en']) {
      for (const key of ['title', 'summary', 'deliverable', 'tools', 'scope']) {
        if (!task[lang][key]?.trim()) throw new Error(`Missing ${task.id}.${lang}.${key}`);
      }
      if (task[lang].checks.length < 3) throw new Error(`Missing review criteria: ${task.id}.`);
    }
  }
}

export function renderAll(data) {
  validate(data);
  const { shared: s, languages, tasks } = data;
  const outputs = new Map();
  for (const lang of ['es', 'en']) {
    const t = languages[lang], base = lang === 'es' ? './' : '../';
    const home = lang === 'es' ? 'index.html' : 'en/index.html';
    const guideFile = lang === 'es' ? 'guia/index.html' : 'en/guide/index.html';
    const guideURL = lang === 'es' ? 'guia/' : 'guide/';
    const planPath = `public/${lang}/${lang === 'es' ? 'plan-publico' : 'public-plan'}.md`;
    const taskPath = `public/${lang}/${lang === 'es' ? 'primeras-contribuciones' : 'first-contributions'}.md`;
    const homeRoute = lang === 'es' ? '' : 'en/';
    const resources = s.resources.map(r => ({ ...r, title: r.name[lang], detail: r.description[lang] }));
    const intro = t.introTemplate.replace('{task}', t.defaultTask);
    const issueURL = `${s.repo}/issues/new?template=contribution.yml`;
    const nav = (prefix, isGuide) => `<a class="skip" href="#contenido">${e(t.nav.skip)}</a>
<header class="top"><div class="wrap header-row">
<a class="brand" href="${prefix}${homeRoute}"><span class="brand-dot" aria-hidden="true"></span>${e(s.name)}</a>
<nav class="desktop-nav" aria-label="${e(t.nav.label)}">${[['tareas', t.nav.tasks], ['empezar', t.nav.start], ['recursos', t.nav.resources]].map(([id, name]) => `<a href="${isGuide ? prefix + homeRoute : ''}#${id}">${e(name)}</a>`).join('')}</nav>
<nav class="languages" aria-label="${e(t.nav.language)}">${['es', 'en'].map(l => `<a href="${prefix}${isGuide ? (l === 'es' ? 'guia/' : 'en/guide/') : (l === 'es' ? './' : 'en/')}" lang="${l}" hreflang="${l}" aria-label="${l === 'es' ? 'Español' : 'English'}"${l === lang ? ' aria-current="page"' : ''}>${l.toUpperCase()}</a>`).join('')}</nav>
<details class="mobile-menu"><summary>${e(t.nav.menu)}</summary><nav aria-label="${e(t.nav.label)}">${[['tareas', t.nav.tasks], ['empezar', t.nav.start], ['recursos', t.nav.resources], ['plan', t.nav.plan]].map(([id, name]) => `<a href="${isGuide ? prefix + homeRoute : ''}#${id}">${e(name)}</a>`).join('')}<a href="${prefix}${lang === 'es' ? 'guia/' : 'en/guide/'}">${e(t.nav.guide)}</a></nav></details>
</div></header>`;
    const foot = prefix => `<footer class="footer"><div class="wrap footer-grid"><div><a class="brand" href="${prefix}${homeRoute}">${e(s.name)}</a><p>${e(t.footer)}</p><p class="small">${e(t.updatedLabel)}: <time datetime="${e(s.updated)}">${e(t.date)}</time></p></div><div class="footer-links"><a href="${s.repo}">${e(t.repo)}</a><a href="${s.repo}/blob/main/CONTRIBUTING.md">${e(t.contribute)}</a><a href="${s.discord}">Discord</a><a href="${prefix}${planPath}" download>${e(t.downloadPlan)}</a><a href="${prefix}${taskPath}" download>${e(t.downloadGuide)}</a><button class="text-button print-button" type="button" hidden>${e(t.print)}</button></div></div><div class="wrap credits"><p>${e(t.credits)} <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · <a href="https://ve.creativecommons.net/">Creative Commons Venezuela</a></p><p>${e(t.artCredit)}</p></div></footer>`;
    const shell = (title, body, prefix, isGuide = false) => `<!doctype html>
<!-- Generated by scripts/build.mjs from content/site.json. Do not edit generated pages. -->
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)} · ${e(s.name)}</title><meta name="description" content="${e(t.description)}"><meta name="theme-color" content="#fbf6ee"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)} · ${e(s.name)}"><meta property="og:description" content="${e(t.description)}"><meta property="og:url" content="${s.url}${isGuide ? (lang === 'es' ? 'guia/' : 'en/guide/') : homeRoute}"><meta property="og:image" content="${s.url}img/ccve.png"><meta property="og:image:alt" content="Creative Commons Venezuela"><meta property="og:locale" content="${lang === 'es' ? 'es_VE' : 'en_US'}"><meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="${s.url}${isGuide ? (lang === 'es' ? 'guia/' : 'en/guide/') : homeRoute}">${['es', 'en'].map(l => `<link rel="alternate" hreflang="${l}" href="${s.url}${isGuide ? (l === 'es' ? 'guia/' : 'en/guide/') : (l === 'es' ? '' : 'en/')}">`).join('')}<link rel="stylesheet" href="${prefix}assets/site.css"><script src="${prefix}assets/site.js" defer></script></head><body>${nav(prefix, isGuide)}${body}${foot(prefix)}</body></html>\n`;
    const card = task => {
      const x = task[lang];
      return `<article class="task-card" id="tarea-${task.id}" data-skills="${e(task.skills.join(' '))}" data-minutes="${task.minutes}" data-title="${e(x.title)}"><div class="task-meta"><span class="route">${e(task.track)}</span><span>${task.minutes} ${e(t.minutes)} · ${e(t.beginner)}</span></div><h3>${e(x.title)}</h3><p>${e(x.summary)}</p><div class="deliverable"><span class="eyebrow">${e(t.deliverable)}</span><p>${e(x.deliverable)}</p></div><details class="task-details"><summary>${e(t.details)}</summary><h4>${e(t.done)}</h4>${list(x.checks)}<h4>${e(t.scope)}</h4><p>${e(x.scope)}</p></details><div class="task-bottom"><a class="task-choose" href="#empezar">${e(t.choose)} <span aria-hidden="true">↗</span></a><a class="small" href="${guideURL}#${task.id}">${e(t.brief)}<span class="sr-only">: ${e(x.title)}</span></a></div></article>`;
    };
    const main = `<main id="contenido" tabindex="-1">
<div class="wrap"><aside class="emergency"><strong>${e(t.emergency)}</strong> ${e(t.emergencyMore)}</aside></div>
<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">${e(t.eyebrow)}</p><h1 id="hero-title">${e(t.title)}</h1><p class="lead">${e(t.heroLead)}</p><div class="buttons"><a class="button primary" href="#tareas">${e(t.heroPrimary)} <span aria-hidden="true">↓</span></a><a class="button secondary" href="${guideURL}">${e(t.heroSecondary)}</a></div></div><aside class="quickstart"><img src="${base}assets/network.svg" width="840" height="340" alt="${e(t.heroArt)}"><div><p class="eyebrow">01 / ${e(t.nav.start)}</p><h2>${e(t.quickTitle)}</h2><p>${e(t.quickBody)}</p><a href="?time=60#tareas" id="quick-hour">${e(t.quickLink)} <span aria-hidden="true">→</span></a></div></aside></section>
<div class="wrap"><aside class="proposal"><strong><span class="status-dot" aria-hidden="true"></span>${e(t.proposal)}</strong><p>${e(t.statusText)}</p></aside><div class="facts">${t.facts.map(([n, label]) => `<div><strong>${e(n)}</strong><span>${e(label)}</span></div>`).join('')}</div></div>
<section class="section wrap" id="tareas" aria-labelledby="tasks-title"><div class="section-heading"><p class="eyebrow">01 / ${e(t.nav.tasks)}</p><h2 id="tasks-title">${e(t.tasksTitle)}</h2><p>${e(t.tasksIntro)}</p></div>
<form id="task-filters" class="filters" hidden><div><label for="skill">${e(t.filterSkill)}</label><select id="skill" name="skill">${Object.entries(t.skills).map(([value, text]) => `<option value="${e(value)}">${e(text)}</option>`).join('')}</select></div><div><label for="time">${e(t.filterTime)}</label><select id="time" name="time">${Object.entries(t.times).map(([value, text]) => `<option value="${e(value)}">${e(text)}</option>`).join('')}</select></div><button type="reset" class="text-button">${e(t.reset)}</button></form>
<p id="task-status" class="small result-count" role="status" aria-live="polite" aria-atomic="true" data-label="${e(t.result)}" data-singular="${e(t.resultSingular)}">${tasks.length} ${e(t.result)}</p><div class="task-grid">${tasks.map(card).join('')}</div><p id="no-tasks" class="empty" hidden>${e(t.empty)}</p></section>
<section class="section start-section" id="empezar" aria-labelledby="start-title"><div class="wrap"><div class="section-heading"><p class="eyebrow">02 / ${e(t.nav.start)}</p><h2 id="start-title">${e(t.startTitle)}</h2><p>${e(t.startIntro)}</p></div><ol class="steps">${t.steps.map(([title, text], i) => `<li><span class="step-num" aria-hidden="true">0${i + 1}</span><h3>${e(title)}</h3><p>${e(text)}</p></li>`).join('')}</ol><div class="message-panel"><div><h3><label for="intro-message">${e(t.introLabel)}</label></h3><p id="intro-help">${e(t.introHelp)}</p><p class="small">${e(t.noGithub)}</p><div class="buttons"><a class="button primary" href="${s.discord}">${e(t.discord)} <span aria-hidden="true">↗</span></a><a class="button secondary" href="${issueURL}">${e(t.githubProposal)}</a></div><p class="print-contact">Discord: ${e(s.discord)}<br>GitHub: ${e(s.repo)}</p></div><div><textarea id="intro-message" rows="9" aria-describedby="intro-help" spellcheck="true">${e(intro)}</textarea><template id="message-template">${e(t.introTemplate)}</template><button id="copy-intro" class="button secondary" type="button" hidden data-success="${e(t.copied)}" data-error="${e(t.copyError)}">${e(t.copy)}</button><p class="small feedback" id="message-status" role="status" aria-live="polite" data-prepared="${e(t.prepared)}"></p></div></div></div></section>
<section class="section wrap" aria-labelledby="quality-title"><div class="section-heading"><p class="eyebrow">03 / ${e(t.submission)}</p><h2 id="quality-title">${e(t.qualityTitle)}</h2><p>${e(t.qualityIntro)}</p></div><div class="quality-grid">${t.quality.map(([title, body]) => `<article><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join('')}</div></section>
<section class="section resources-section" id="recursos" aria-labelledby="resources-title"><div class="wrap"><div class="section-heading"><p class="eyebrow">04 / ${e(t.nav.resources)}</p><h2 id="resources-title">${e(t.resourcesTitle)}</h2><p>${e(t.resourcesIntro)}</p></div><div class="resource-grid">${resources.map(r => `<article><h3>${resourceLink(r)} <span aria-hidden="true">↗</span></h3><p>${e(r.detail)}</p><span class="small">${e(new URL(r.url).hostname)}</span></article>`).join('')}</div><p class="small resource-note">${e(t.resourceNote)}</p></div></section>
<section class="section wrap" id="plan" aria-labelledby="plan-title"><div class="plan-grid"><div class="section-heading"><p class="eyebrow">05 / ${e(t.nav.plan)}</p><h2 id="plan-title">${e(t.planTitle)}</h2><p>${e(t.planIntro)}</p><a href="${base}${planPath}" download>${e(t.downloadPlan)} <span aria-hidden="true">↓</span></a></div><div class="plan-text">${t.planParagraphs.map(p => `<p>${e(p)}</p>`).join('')}</div></div><h3 class="routes-title">${e(t.tracksTitle)}</h3><div class="routes-grid">${t.tracks.map(([letter, title, body]) => `<article><span class="route">${e(letter)}</span><h4>${e(title)}</h4><p>${e(body)}</p></article>`).join('')}</div></section>
<section class="section faq-section" aria-labelledby="faq-title"><div class="wrap faq-grid"><div class="section-heading"><p class="eyebrow">FAQ</p><h2 id="faq-title">${e(t.faqTitle)}</h2></div><div>${t.faq.map(([q, a]) => `<details class="faq"><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div></div></section></main>`;
    outputs.set(home, shell(t.title, main, base));
    const guideBase = lang === 'es' ? '../' : '../../';
    const guide = `<main id="contenido" class="wrap guide" tabindex="-1"><a class="back-link" href="${guideBase}${homeRoute}#tareas">← ${e(t.back)}</a><p class="eyebrow">${e(s.name)} / ${e(t.nav.guide)}</p><h1>${e(t.guideTitle)}</h1><p class="lead">${e(t.guideIntro)}</p><aside class="emergency"><strong>${e(t.emergency)}</strong> ${e(t.emergencyMore)}</aside><nav class="guide-toc" aria-label="${e(t.nav.tasks)}"><ol>${tasks.map(task => `<li><a href="#${task.id}">${e(task[lang].title)}</a> <span class="small">(${task.minutes} ${e(t.minutes)})</span></li>`).join('')}</ol></nav><div class="guide-contact"><p>${e(t.guideContact)}</p><p>Discord: <a href="${s.discord}">${e(s.discord)}</a><br>GitHub: <a href="${s.repo}/issues/new?template=contribution.yml">${e(s.repo)}/issues</a><br>Web: <a href="${s.url}${homeRoute}">${e(s.url)}${homeRoute}</a></p><button class="button secondary print-button" type="button" hidden>${e(t.print)}</button></div>${tasks.map(task => {
      const x = task[lang], sources = resources.filter(r => task.sourceIds.includes(r.id));
      if (task.starter) sources.push({ title: t.starterLabel, url: `${s.repo}/blob/main/${task.starter}` });
      return `<article class="guide-task" id="${task.id}"><p class="eyebrow">${e(task.track)} · ${task.minutes} ${e(t.minutes)} · ${e(t.proposed)}</p><h2>${e(x.title)}</h2><p>${e(x.summary)}</p><h3>${e(t.deliverable)}</h3><p>${e(x.deliverable)}</p><h3>${e(t.tools)}</h3><p>${e(x.tools)}</p><h3>${e(t.done)}</h3>${list(x.checks)}<aside class="scope"><h3>${e(t.scope)}</h3><p>${e(x.scope)}</p></aside>${sources.length ? `<h3>${e(t.sources)}</h3>${listLinks(sources)}` : `<p><a href="${s.repo}">${e(t.repo)} · ${e(s.name)}</a></p>`}</article>`;
    }).join('')}<section class="guide-submission"><h2>${e(t.submission)}</h2>${list(t.submissionItems)}<h3>${e(t.introLabel)}</h3><pre class="message-example">${e(intro)}</pre><p>${e(t.guideContact)} <a href="${s.discord}">${e(s.discord)}</a></p></section></main>`;
    outputs.set(guideFile, shell(t.guideTitle, guide, guideBase, true));
    const credit = `${t.credits}\n\n${t.artCredit}\n\nhttps://creativecommons.org/licenses/by-sa/4.0/`;
    outputs.set(planPath, `# ${s.name} · ${t.guidePlan}\n\n${t.updatedLabel}: ${s.updated}\n\n> ${t.emergency} ${t.emergencyMore}\n\n## ${t.proposal}\n\n${t.statusText}\n\n${t.planIntro}\n\n${t.planParagraphs.join('\n\n')}\n\n## ${t.tracksTitle}\n\n${t.tracks.map(([l, n, b]) => `- **${l} ${n}**: ${b}`).join('\n')}\n\n## ${t.nav.start}\n\n${t.steps.map(([a, b], i) => `${i + 1}. **${a}.** ${b}`).join('\n\n')}\n\n${t.guideContact}\n\n- Discord: ${s.discord}\n- GitHub: ${s.repo}/issues\n- Web: ${s.url}${homeRoute}\n- ${t.nav.guide}: ${s.url}${lang === 'es' ? 'guia/' : 'en/guide/'}\n\n## ${t.qualityTitle}\n\n${t.quality.map(([a, b]) => `- **${a}**: ${b}`).join('\n')}\n\n## ${t.nav.resources}\n\n${resources.map(r => `- [${r.title}](${r.url}): ${r.detail}`).join('\n')}\n\n${t.resourcesIntro}\n\n## ${lang === 'es' ? 'Licencia y créditos' : 'License and credits'}\n\n${credit}\n`);
    outputs.set(taskPath, `# ${s.name} · ${t.guideTitle}\n\n${t.updatedLabel}: ${s.updated}\n\n${t.guideIntro}\n\n> ${t.emergency} ${t.emergencyMore}\n\n${t.guideContact}\n\n- Discord: ${s.discord}\n- GitHub: ${s.repo}/issues\n- Web: ${s.url}${homeRoute}\n\n${tasks.map(task => {
      const x = task[lang];
      return `## ${task.track} · ${x.title}\n\n${task.minutes} ${t.minutes} · ${t.proposed}\n\n${x.summary}\n\n**${t.deliverable}:** ${x.deliverable}\n\n**${t.tools}:** ${x.tools}\n\n### ${t.done}\n\n${x.checks.map(c => `- ${c}`).join('\n')}\n\n**${t.scope}:** ${x.scope}\n\n${task.sourceIds.map(id => {const r = resources.find(r => r.id === id);return `- [${r.title}](${r.url})`;}).join('\n')}${task.starter ? `\n- [${t.starterLabel}](${s.repo}/blob/main/${task.starter})` : ''}`;
    }).join('\n\n')}\n\n## ${t.submission}\n\n${t.submissionItems.map(x => `- ${x}`).join('\n')}\n\n## ${t.introLabel}\n\n${intro}\n\n${credit}\n`);
  }
  return outputs;
}
function listLinks(resources) {
  return `<ul>${resources.map(r => `<li>${resourceLink(r)}</li>`).join('')}</ul>`;
}

async function main() {
  const outputs = renderAll(JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8')));
  const check = process.argv.includes('--check');
  for (const [name, text] of outputs) {
    const target = path.join(root, name);
    if (check) {
      let current;
      try { current = await readFile(target, 'utf8'); } catch { /* report missing output below */ }
      if (current !== text) throw new Error(`${name} is stale or missing. Run npm run build and commit the result.`);
    } else {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, text);
    }
  }
  console.log(`${check ? 'Verified' : 'Generated'} ${outputs.size} public files.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
