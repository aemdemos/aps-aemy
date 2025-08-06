/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Accordion (accordion17)'];
  const rows = [];

  // Find all direct .card children (each accordion item)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // TITLE CELL
    let titleCell = '';
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Use the whole header, but prefer h2 inside if present
      const h2 = header.querySelector('h2');
      titleCell = h2 || header;
    }

    // CONTENT CELL
    let contentCell = '';
    // content is in .card-body inside .collapse
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      // If card-body exists, use it, else use collapse container
      contentCell = body || collapse;
    }
    rows.push([titleCell, contentCell]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
