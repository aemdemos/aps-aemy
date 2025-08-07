/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards18)'];
  // Get all immediate child cards
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];

  cards.forEach((card) => {
    // Icon cell: the icon itself (use element reference)
    const icon = card.querySelector('i');
    // Text cell: number (span.cartfig, as strong), <br>, label (p)
    const fig = card.querySelector('.cartfig');
    const label = card.querySelector('p');
    const textCell = document.createElement('div');
    if (fig && fig.textContent) {
      const strong = document.createElement('strong');
      strong.textContent = fig.textContent;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    if (label && label.textContent) {
      textCell.appendChild(document.createTextNode(label.textContent));
    }
    rows.push([
      icon || document.createTextNode(''),
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
