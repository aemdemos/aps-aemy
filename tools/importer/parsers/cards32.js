/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards32)']; // header EXACT match
  // Get all immediate card divs
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  const rows = cardDivs.map(card => {
    // Find the icon (i.fa), the value (span.cartfig), and the description (p)
    const icon = card.querySelector('i');
    const value = card.querySelector('.cartfig');
    const description = card.querySelector('p');

    // Left cell: icon and value centered/stacked
    const leftCell = document.createElement('div');
    if (icon) leftCell.appendChild(icon);
    if (value) {
      leftCell.appendChild(document.createElement('br'));
      leftCell.appendChild(value);
    }

    // Right cell: bolded value and description below
    const rightCell = document.createElement('div');
    if (value) {
      const strong = document.createElement('strong');
      strong.textContent = value.textContent.trim();
      rightCell.appendChild(strong);
      rightCell.appendChild(document.createElement('br'));
    }
    if (description) {
      rightCell.appendChild(description);
    }

    return [leftCell, rightCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
