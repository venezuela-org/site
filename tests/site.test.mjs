import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { root, renderAll, validate, escapeHTML } from '../scripts/build.mjs';

const data = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const generated = renderAll(data);
const htmlFiles = [...generated].filter(([name]) => name.endsWith('.html'));
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attributes = text => Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));

test('all generated files match their committed content', async () => {
  assert.equal(generated.size, 8);
  for (const [file, content] of generated) assert.equal(await readFile(path.join(root, file), 'utf8'), content, file);
});

test('every page has unique IDs, a main landmark, real content and a language-specific canonical URL', () => {
  for (const [file, html] of htmlFiles) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, file);
    assert.equal((html.match(/<main\b/g) || []).length, 1, file);
    assert.match(html, /<h1[^>]*>[^<]+<\/h1>/);
    assert.match(html, /<html lang="(?:es|en)">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/venezuela-org.github.io\/site\//);
    assert.match(html, /aria-current="page"/);
    assert.doesNotMatch(html, /href="#"|<h[1-6][^>]*>\s*<\//);
    assert.doesNotMatch(html, /fonts\.google|<canvas|onerror=|<script>/);
    assert.match(html, /This is not an emergency service|Esto no es un servicio de emergencia/);
  }
});

test('every generated local link and fragment resolves, including language switches and downloads', async () => {
  for (const [file, html] of htmlFiles) {
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const raw = decode(match[1]);
      if (/^https:\/\//.test(raw)) continue;
      const url = new URL(raw, `https://local.test/${file}`);
      let target = decodeURIComponent(url.pathname.slice(1));
      if (!target || target.endsWith('/')) target += 'index.html';
      const info = await stat(path.join(root, target)).catch(() => null);
      assert.ok(info?.isFile(), `${file}: ${raw} => ${target}`);
      if (url.hash) {
        const content = generated.get(target) ?? await readFile(path.join(root, target), 'utf8');
        assert.ok(content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing fragment ${raw}`);
      }
    }
  }
});

test('repository documentation links resolve locally', async () => {
  for (const file of ['README.md', 'README-public.md', 'CONTRIBUTING.md', 'SECURITY.md', 'LICENSE.md']) {
    const md = await readFile(path.join(root, file), 'utf8');
    for (const match of md.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (/^https:\/\//.test(match[1])) continue;
      const filePart = match[1].split('#')[0];
      if (filePart) assert.ok((await stat(path.join(root, filePart))).isFile(), `${file}: ${match[1]}`);
    }
  }
});

test('task briefs have bounded deliverables, review criteria and valid resource references', () => {
  validate(data);
  assert.equal(data.tasks.length, 6);
  for (const [file, html] of htmlFiles) {
    for (const task of data.tasks) assert.ok(html.includes(escapeHTML(task[file.startsWith('en/') ? 'en' : 'es'].deliverable)), `${file}: ${task.id}`);
  }
  for (const lang of ['es', 'en']) {
    const guide = generated.get(lang === 'es' ? 'guia/index.html' : 'en/guide/index.html');
    for (const task of data.tasks) {
      for (const criterion of task[lang].checks) assert.ok(guide.includes(escapeHTML(criterion)));
    }
  }
});

test('printable guides and Markdown plans retain useful contact addresses and accurate credits', () => {
  for (const [file, content] of generated) {
    assert.ok(content.includes(data.shared.discord), `${file}: Discord address`);
    assert.ok(content.includes(data.shared.repo), `${file}: repository address`);
    assert.doesNotMatch(content, /no third-party images|no se usan imágenes de terceros|expected start: August|arranque previsto: agosto/);
    assert.match(content, /Creative Commons Venezuela/);
  }
});

test('schema rejects incomplete translations, ambiguous task IDs and insecure source URLs', () => {
  const missing = structuredClone(data); delete missing.languages.en.nav.menu;
  assert.throws(() => validate(missing), /Language structures/);
  const duplicate = structuredClone(data); duplicate.tasks[1].id = duplicate.tasks[0].id;
  assert.throws(() => validate(duplicate), /unique/);
  const insecure = structuredClone(data); insecure.shared.resources[0].url = 'http://example.com';
  assert.throws(() => validate(insecure), /HTTPS/);
  const invalidSource = structuredClone(data); invalidSource.tasks[0].sourceIds = ['missing'];
  assert.throws(() => validate(invalidSource), /Unknown source/);
});

test('content is escaped before insertion into HTML attributes and text', () => {
  const hostile = structuredClone(data);
  hostile.tasks[0].es.title = '"><script>alert(1)</script>&';
  const html = renderAll(hostile).get('index.html');
  assert.ok(html.includes('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&amp;'));
  assert.doesNotMatch(html, /<script>alert/);
});

const css = await readFile(path.join(root, 'assets/site.css'), 'utf8');
function luminance(hex) {
  const rgb = hex.match(/[\da-f]{2}/gi).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
test('body, accent, muted, button and card text colors meet 4.5:1', () => {
  const tokens = Object.fromEntries([...css.matchAll(/--([\w-]+):(#[a-f\d]{6})/gi)].map(m => [m[1], m[2]]));
  for (const [a, b] of [['ink', 'paper'], ['muted', 'paper'], ['muted', 'paper-deep'], ['amber', 'paper'], ['teal', 'paper'], ['amber', 'white']]) {
    assert.ok(contrast(tokens[a], tokens[b]) >= 4.5, `${a}/${b}`);
  }
  assert.ok(contrast('#ffffff', tokens.amber) >= 4.5, 'primary button');
  for (const [a, b] of [['#76430b', '#f5e5cc'], ['#e6b677', tokens.ink], ['#b5e5d6', tokens.ink], ['#284c3d', tokens['teal-soft']]]) assert.ok(contrast(a, b) >= 4.5);
});

test('print does not depend on reveal animations and restores filtered task cards', () => {
  assert.doesNotMatch(css, /opacity:\s*0[;}]/);
  assert.match(css, /@media print\s*\{/);
  assert.match(css, /\.task-card\[hidden\]\s*\{\s*display:block!important/);
  assert.match(css, /\.print-contact\s*\{\s*display:block/);
  assert.match(css, /prefers-reduced-motion:no-preference/);
});

const script = await readFile(path.join(root, 'assets/site.js'), 'utf8');
function harness(lang = 'es', query = '', clipboardWorks = true) {
  const html = generated.get(lang === 'es' ? 'index.html' : 'en/index.html');
  const elements = new Map(), listeners = new Map();
  class Element {
    constructor(attrs = {}) {
      this.attrs = attrs; this.hidden = false; this.value = ''; this.textContent = ''; this.dataset = {};
      this.handlers = new Map(); this.focused = false; this.selected = false;
      for (const [key, value] of Object.entries(attrs)) if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    }
    addEventListener(name, fn) { this.handlers.set(name, fn); }
    async dispatch(name) { let prevented = false; await this.handlers.get(name)?.({ preventDefault() { prevented = true; } }); return prevented; }
    focus() { this.focused = true; }
    select() { this.selected = true; }
    scrollIntoView() { this.scrolled = true; }
  }
  for (const match of html.matchAll(/<\w+\b[^>]*\bid="[^"]+"[^>]*>/g)) {
    const attrs = attributes(match[0]); elements.set(attrs.id, new Element(attrs));
  }
  const cards = [...html.matchAll(/<article class="task-card"[^>]*>/g)].map(m => new Element(attributes(m[0])));
  const choices = cards.map(card => { const link = new Element(); link.closest = () => card; return link; });
  for (const [id, values] of [['skill', Object.keys(data.languages[lang].skills)], ['time', Object.keys(data.languages[lang].times)]]) {
    const el = elements.get(id); el.name = id; el.options = values.map(value => ({ value }));
  }
  elements.get('intro-message').value = data.languages[lang].introTemplate.replace('{task}', data.languages[lang].defaultTask);
  elements.get('message-template').content = { textContent: data.languages[lang].introTemplate };
  const prints = [new Element()], menu = new Element(); menu.open = true;
  const menuLink = new Element(); menuLink.closest = () => menu;
  const window = {
    location: new URL(`https://example.test/${lang === 'es' ? '' : 'en/'}${query}`),
    addEventListener(name, fn) { listeners.set(name, fn); },
    history: { replaceState(_state, _title, url) { window.location = new URL(url); } },
    print() { window.printed = true; }
  };
  const document = {
    getElementById: id => elements.get(id),
    querySelectorAll: sel => ({ '.task-card': cards, '.task-choose': choices, '.print-button': prints, '.mobile-menu a': [menuLink] })[sel] || []
  };
  const clipboard = { async writeText(text) { if (!clipboardWorks) throw new Error('Denied'); clipboard.text = text; } };
  vm.runInNewContext(script, { document, window, navigator: { clipboard }, URL, URLSearchParams });
  return { elements, cards, choices, prints, menuLink, menu, window, listeners, clipboard, visible: () => cards.filter(c => !c.hidden).length };
}
for (const lang of ['es', 'en']) {
  test(`${lang}: filter intersection, empty state, reset and quick-hour action`, async () => {
    const h = harness(lang), form = h.elements.get('task-filters');
    assert.equal(h.visible(), 6);
    assert.equal(form.hidden, false);
    await h.elements.get('quick-hour').dispatch('click');
    assert.equal(h.visible(), 4);
    assert.equal(h.window.location.search, '?time=60');
    h.elements.get('skill').value = 'code'; await form.dispatch('change');
    assert.equal(h.visible(), 0);
    assert.equal(h.elements.get('no-tasks').hidden, false);
    assert.equal(h.elements.get('task-status').textContent, `0 ${data.languages[lang].result}`);
    await form.dispatch('reset');
    assert.equal(h.visible(), 6); assert.equal(h.window.location.search, '');
    h.elements.get('skill').value = 'code'; await form.dispatch('change');
    assert.equal(h.visible(), 1);
    assert.equal(h.elements.get('task-status').textContent, `1 ${data.languages[lang].resultSingular}`);
    h.elements.get('skill').value = 'data'; h.elements.get('time').value = '60';
    assert.equal(await form.dispatch('submit'), true); assert.equal(h.visible(), 2);
  });
  test(`${lang}: invalid URL filters fall back and history changes are applied`, () => {
    const h = harness(lang, '?skill=unknown&time=999'); assert.equal(h.visible(), 6);
    h.window.location = new URL('https://example.test/?skill=code&time=60'); h.listeners.get('popstate')();
    assert.equal(h.visible(), 0);
  });
  test(`${lang}: task selection prepares editable text and copies only on request`, async () => {
    const h = harness(lang); assert.equal(h.clipboard.text, undefined);
    await h.choices[0].dispatch('click');
    const message = h.elements.get('intro-message');
    assert.ok(message.value.includes(data.tasks[0][lang].title)); assert.equal(message.focused, true);
    message.value += '\nMy own addition';
    await h.elements.get('copy-intro').dispatch('click');
    assert.equal(h.clipboard.text, message.value);
    assert.equal(h.elements.get('message-status').textContent, data.languages[lang].copied);
  });
}
test('clipboard denial leaves the draft selected with a manual-copy explanation', async () => {
  const h = harness('en', '', false); await h.elements.get('copy-intro').dispatch('click');
  assert.equal(h.elements.get('intro-message').selected, true);
  assert.equal(h.elements.get('message-status').textContent, data.languages.en.copyError);
});
test('print controls work and native mobile menu closes after navigation', async () => {
  const h = harness(); await h.prints[0].dispatch('click'); assert.equal(h.window.printed, true);
  await h.menuLink.dispatch('click'); assert.equal(h.menu.open, false);
});
test('guide enhancement does not depend on task controls and makes no network or storage calls', () => {
  assert.doesNotMatch(script, /\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\b/);
  let attached = false;
  vm.runInNewContext(script, { document: { getElementById: () => null, querySelectorAll: sel => sel === '.print-button' ? [{ hidden: true, addEventListener() { attached = true; } }] : [] } });
  assert.equal(attached, true);
});


test('the synthetic exercise reproduces the documented totals from any working directory', async () => {
  const { stdout } = await promisify(execFile)(process.execPath, [path.join(root, 'examples/synthetic-table/summarise.mjs')], { cwd: '/' });
  assert.equal(stdout, 'SYNTHETIC EXAMPLE / EJEMPLO SINTÉTICO\nA: 6\nB: 5\nC: 1\n');
  const source = JSON.parse(await readFile(path.join(root, 'examples/synthetic-table/data.json'), 'utf8'));
  assert.equal(source.synthetic, true);
  assert.equal(source.rows.length, 5);
});

test('every task starter exists in the repository', async () => {
  for (const task of data.tasks) {
    if (task.starter) assert.ok((await stat(path.join(root, task.starter))).isFile());
  }
});


test('GitHub Pages serves the generated files directly without Jekyll conversion', async () => {
  assert.ok((await stat(path.join(root, '.nojekyll'))).isFile());
});

test('without JavaScript, every task, brief link and introduction remains in the HTML', () => {
  for (const file of ['index.html', 'en/index.html']) {
    const html = generated.get(file).replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
    assert.equal((html.match(/class="task-card"/g) || []).length, 6);
    assert.match(html, /id="task-filters" class="filters" hidden/);
    assert.match(html, /<textarea[^>]+>[\s\S]+<\/textarea>/);
    assert.equal((html.match(/class="small" href="(?:guia|guide)\/#/g) || []).length, 6);
    assert.ok(html.includes(`href="${data.shared.discord}"`));
  }
});
