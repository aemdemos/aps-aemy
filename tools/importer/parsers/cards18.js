/* global WebImporter */
export default function parse(element, { document }) {
  // Collect card rows
  const rows = [];
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach((card) => {
    const icon = card.querySelector('i');
    const stat = card.querySelector('span.cartfig');
    const label = card.querySelector('p');
    const textCell = document.createElement('div');
    if (stat) {
      const strong = document.createElement('strong');
      strong.textContent = stat.textContent;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    if (label) {
      textCell.appendChild(label);
    }
    rows.push([icon, textCell]);
  });
  // Header row: single <th> with colspan=2 for proper table alignment
  const th = document.createElement('th');
  th.textContent = 'Cards (cards18)';
  th.setAttribute('colspan', '2');
  const headerRow = [th];
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
