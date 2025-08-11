/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Accordion (accordion27)'];

  // Select all direct card children
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach(card => {
    // Title: from card-header (should be the <h2> inside it), fallback to header
    let titleCell = null;
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      const h2 = header.querySelector('h2, .h2');
      titleCell = h2 || header;
    }
    // Content: from .collapse > .card-body, fallback to .collapse, fallback to card
    let contentCell = null;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const body = collapse.querySelector(':scope > .card-body');
      contentCell = body || collapse;
    } else {
      contentCell = card;
    }
    rows.push([titleCell, contentCell]);
  });
  
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
