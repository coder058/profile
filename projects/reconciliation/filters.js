// SOURCE: filter only the already computed static rows; never recompute quantities in JS.
const buttons = [...document.querySelectorAll('[data-filter]')];
const rows = [...document.querySelectorAll('tbody tr[data-state]')];
for (const button of buttons) {
  button.addEventListener('click', () => {
    for (const choice of buttons) choice.setAttribute('aria-pressed', String(choice === button));
    for (const row of rows) row.hidden = button.dataset.filter !== 'all' && row.dataset.state !== button.dataset.filter;
    document.querySelector('#visible-count').textContent = `Showing ${rows.filter(row => !row.hidden).length} of ${rows.length} orders.`;
  });
}
