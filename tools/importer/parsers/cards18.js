/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const headerRow = ['Cards (cards18)'];
  // Each card is a direct child of element
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];
  cardDivs.forEach(card => {
    // Icon extraction
    const icon = card.querySelector('i');
    // Number extraction
    const number = card.querySelector('span');
    // Label extraction
    const label = card.querySelector('p');
    // First cell: icon and number vertically stacked
    const iconContainer = document.createElement('div');
    if (icon) iconContainer.appendChild(icon);
    if (number) {
      iconContainer.appendChild(document.createElement('br'));
      iconContainer.appendChild(number);
    }
    // Second cell: label element (retains formatting)
    const labelContent = label || '';
    rows.push([iconContainer, labelContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
