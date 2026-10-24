/* Progressive enhancement only: content and navigation work without this file. */
(() => {
  'use strict';
  const filters = document.getElementById('task-filters');
  if (filters) {
    const skill = document.getElementById('skill');
    const time = document.getElementById('time');
    const cards = [...document.querySelectorAll('.task-card')];
    const status = document.getElementById('task-status');
    const empty = document.getElementById('no-tasks');
    function readQuery() {
      const query = new URLSearchParams(window.location.search);
      skill.value = [...skill.options].some(o => o.value === query.get('skill')) ? query.get('skill') : 'all';
      time.value = [...time.options].some(o => o.value === query.get('time')) ? query.get('time') : 'all';
    }
    function apply(updateURL = false) {
      let count = 0;
      for (const card of cards) {
        const matchesSkill = skill.value === 'all' || card.dataset.skills.split(' ').includes(skill.value);
        const matchesTime = time.value === 'all' || Number(card.dataset.minutes) <= Number(time.value);
        card.hidden = !(matchesSkill && matchesTime);
        if (!card.hidden) count++;
      }
      status.textContent = `${count} ${count === 1 ? status.dataset.singular : status.dataset.label}`;
      empty.hidden = count !== 0;
      if (updateURL) {
        const url = new URL(window.location.href);
        for (const input of [skill, time]) {
          if (input.value === 'all') url.searchParams.delete(input.name);
          else url.searchParams.set(input.name, input.value);
        }
        // Filtering still works if history mutation is unavailable (e.g. a local file).
        try { window.history.replaceState(null, '', url); } catch { /* no persistence needed */ }
      }
    }
    filters.addEventListener('change', () => apply(true));
    filters.addEventListener('submit', event => { event.preventDefault(); apply(true); });
    filters.addEventListener('reset', event => {
      event.preventDefault();
      skill.value = time.value = 'all';
      apply(true);
    });
    window.addEventListener('popstate', () => { readQuery(); apply(); });
    readQuery();
    apply();
    filters.hidden = false;
    document.getElementById('quick-hour').addEventListener('click', event => {
      event.preventDefault();
      skill.value = 'all';
      time.value = '60';
      apply(true);
      document.getElementById('tareas').scrollIntoView();
      skill.focus({ preventScroll: true });
    });
    const message = document.getElementById('intro-message');
    const template = document.getElementById('message-template').content.textContent;
    const feedback = document.getElementById('message-status');
    document.querySelectorAll('.task-choose').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const title = link.closest('.task-card').dataset.title;
        message.value = template.replace('{task}', title);
        feedback.textContent = `${feedback.dataset.prepared} ${title}`;
        message.focus();
      });
    });
    const copy = document.getElementById('copy-intro');
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(message.value);
        feedback.textContent = copy.dataset.success;
      } catch {
        message.focus();
        message.select();
        feedback.textContent = copy.dataset.error;
      }
    });
  }
  document.querySelectorAll('.print-button').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => { link.closest('details').open = false; });
  });
})();
