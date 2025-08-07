/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: match the required header exactly
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Find all direct .card children (accordion items)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: the visible title is in .card-header (prefer first heading, fallback to full header)
    let titleCell = '';
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Prefer first heading element (h2-h6)
      const heading = header.querySelector('h2, h3, h4, h5, h6');
      titleCell = heading ? heading : header;
    }
    // Content cell: main content is in .card-body
    let contentCell = '';
    const body = card.querySelector('.card-body');
    if (body) {
      // If there's only 1 child, use it directly, else array of children
      if (body.children.length === 1) {
        contentCell = body.children[0];
      } else if (body.children.length > 1) {
        contentCell = Array.from(body.children);
      } else {
        // fallback: put the whole body if there is text only
        contentCell = body;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
