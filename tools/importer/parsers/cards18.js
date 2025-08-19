/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per requirement
  const headerRow = ['Cards (cards18)'];
  const rows = [];
  // Select all card divs (direct children)
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    // FIRST CELL: icon (reference the existing <i> element)
    const icon = card.querySelector('i');
    // SECOND CELL: number as strong, <br>, and label (p)
    const num = card.querySelector('span.cartfig');
    const p = card.querySelector('p');
    // Compose text cell content
    const cellContent = [];
    if (num) {
      const strong = document.createElement('strong');
      strong.textContent = num.textContent;
      cellContent.push(strong);
    }
    cellContent.push(document.createElement('br'));
    if (p) cellContent.push(p);
    rows.push([icon, cellContent]);
  });
  // Compose full table and replace
  const tableArr = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
