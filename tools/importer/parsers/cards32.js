/* global WebImporter */
export default function parse(element, { document }) {
  // Get all cards (direct children)
  const cards = element.querySelectorAll(':scope > .cart');

  // Build content rows first to determine column count
  const rows = [];

  cards.forEach((card) => {
    const icon = card.querySelector('i');
    const fig = card.querySelector('.cartfig');
    const desc = card.querySelector('p');

    // LEFT cell: icon and number
    const cell1 = document.createElement('div');
    if (icon) cell1.appendChild(icon); // Moves the icon node
    if (fig) cell1.appendChild(fig); // Moves the fig node

    // RIGHT cell: number as heading, description
    const rightCell = document.createElement('div');
    const figText = fig ? fig.textContent.trim() : '';
    if (figText) {
      const strong = document.createElement('strong');
      strong.textContent = figText;
      rightCell.appendChild(strong);
      rightCell.appendChild(document.createElement('br'));
    }
    if (desc) {
      rightCell.appendChild(document.createTextNode(desc.textContent));
    }

    rows.push([cell1, rightCell]);
  });

  // Header row: single cell (should span two columns in rendering), followed by two-column rows.
  const headerRow = ['Cards (cards32)', ''];
  rows.unshift(headerRow);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Optionally set colspan for the header cell
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 2) {
    firstRow.children[0].setAttribute('colspan', '2');
    firstRow.removeChild(firstRow.children[1]);
  }

  element.replaceWith(table);
}
