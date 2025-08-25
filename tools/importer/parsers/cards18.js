/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const headerRow = ['Cards (cards18)'];

  // Get all immediate child cards (each card is a div)
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  const rows = cards.map(card => {
    // First column: the icon (i) and number (span.cartfig)
    const icon = card.querySelector('i');
    const number = card.querySelector('.cartfig');

    // Compose first cell: icon (if present) above number (if present), preserving formatting
    const iconDiv = document.createElement('div');
    if (icon) iconDiv.appendChild(icon);
    if (number) {
      iconDiv.appendChild(document.createElement('br'));
      iconDiv.appendChild(number);
    }

    // Second column: the descriptive text (p)
    const text = card.querySelector('p');
    // Use the paragraph directly if present
    const rightCell = text ? text : document.createElement('span');

    return [iconDiv, rightCell];
  });

  // Build cells: first row is header, following rows are cards
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
