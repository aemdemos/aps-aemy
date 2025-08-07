/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all card elements (immediate children)
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  // Build all data rows first to count columns
  const dataRows = cards.map(card => {
    const icon = card.querySelector('i');
    const iconCell = icon || '';
    const fig = card.querySelector('.cartfig');
    const p = card.querySelector('p');
    const textCellContent = [];
    if (fig) {
      const strong = document.createElement('strong');
      strong.textContent = fig.textContent.trim();
      textCellContent.push(strong);
      if (p) textCellContent.push(document.createElement('br'));
    }
    if (p) textCellContent.push(p);
    return [iconCell, textCellContent];
  });
  // Ensure the header row has the same number of columns as the data rows
  const numCols = dataRows[0] ? dataRows[0].length : 2; // fallback to 2
  const headerRow = ['Cards (cards32)'];
  while (headerRow.length < numCols) headerRow.push('');
  const rows = [headerRow, ...dataRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Add colspan=2 to the header cell so it spans both columns
  const th = table.querySelector('tr:first-child > th');
  if (th && numCols > 1) th.setAttribute('colspan', numCols);
  element.replaceWith(table);
}
