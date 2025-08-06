/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as required
  const rows = [
    ['Accordion (accordion29)']
  ];

  // Get all direct accordion card elements
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title cell: get h2 within .card-header (reference the real element)
    let title = '';
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      if (h2) {
        title = h2;
      } else {
        // fall back to all text content of the header
        title = cardHeader;
      }
    }

    // Content cell: get .card-body element directly
    let content = '';
    const cardBody = card.querySelector(':scope > .collapse > .card-body, :scope > .card-body');
    if (cardBody) {
      content = cardBody;
    }

    rows.push([title, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
