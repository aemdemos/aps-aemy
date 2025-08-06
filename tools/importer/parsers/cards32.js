/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell as per spec
  const headerRow = ['Cards (cards32)'];

  // Get all direct child card divs
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Build 2-column rows for each card
  const rows = cardDivs.map(card => {
    // First column: Icon
    const icon = card.querySelector('i');
    
    // Second column: Number (bold) and description
    const numberSpan = card.querySelector('.cartfig');
    const desc = card.querySelector('p');
    
    const textCell = document.createElement('div');
    if (numberSpan) {
      const strong = document.createElement('strong');
      strong.textContent = numberSpan.textContent.trim();
      textCell.appendChild(strong);
    }
    if (desc) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(desc);
    }
    return [icon, textCell];
  });

  // Compose cells array: header is single-cell row, then 2-col rows
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}