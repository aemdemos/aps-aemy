/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract icon + number + label for each card
  function cardRow(cardDiv) {
    // Left cell: icon (if present)
    const icon = cardDiv.querySelector('i');
    // Right cell: number and label
    const fig = cardDiv.querySelector('.cartfig');
    const desc = cardDiv.querySelector('p');

    // Compose the right cell, referencing actual elements
    const rightCell = document.createElement('div');
    if (fig) {
      const strong = document.createElement('strong');
      strong.textContent = fig.textContent;
      rightCell.appendChild(strong);
    }
    if (desc) {
      rightCell.appendChild(document.createElement('br'));
      rightCell.appendChild(desc);
    }
    // If there is no icon, leave cell empty
    return [icon || '', rightCell];
  }

  // Table header, per spec
  const rows = [['Cards (cards18)']];
  // Select immediate child divs for each card
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    rows.push(cardRow(card));
  });

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
