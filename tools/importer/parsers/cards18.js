/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const rows = [['Cards (cards18)']];

  // Get all direct card divs
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    // First cell: icon (reference the actual element)
    const icon = card.querySelector('i');
    // Second cell: text (number in bold, then description)
    const numberEl = card.querySelector('.cartfig');
    const descEl = card.querySelector('p');
    const textCell = document.createElement('div');
    if (numberEl) {
      const strong = document.createElement('strong');
      strong.textContent = numberEl.textContent;
      textCell.appendChild(strong);
    }
    if (descEl) {
      if (numberEl) textCell.appendChild(document.createElement('br'));
      // Place description as plain text
      textCell.appendChild(document.createTextNode(descEl.textContent));
    }
    rows.push([icon, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
