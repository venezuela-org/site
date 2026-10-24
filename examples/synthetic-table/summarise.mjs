import { readFile } from 'node:fs/promises';

// This example deliberately uses invented categories, with no people or locations.
const data = JSON.parse(await readFile(new URL('./data.json', import.meta.url), 'utf8'));
if (data.synthetic !== true) throw new Error('This exercise only accepts explicitly synthetic data.');
const totals = new Map();
for (const row of data.rows) {
  if (!/^[A-Z]$/.test(row.category) || !Number.isSafeInteger(row.count) || row.count < 0) {
    throw new Error('Expected a one-letter category and a non-negative safe integer.');
  }
  const total = (totals.get(row.category) ?? 0) + row.count;
  if (!Number.isSafeInteger(total)) throw new Error('Total exceeds the safe integer range.');
  totals.set(row.category, total);
}
console.log('SYNTHETIC EXAMPLE / EJEMPLO SINTÉTICO');
for (const [category, count] of [...totals].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${category}: ${count}`);
}
