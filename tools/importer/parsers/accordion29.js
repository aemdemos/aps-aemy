/* global WebImporter */
export default function parse(element, { document }) {
  // Build table rows
  const rows = [
    ['Accordion (accordion29)']
  ];

  // Get all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: .card-header -> try to get heading, else full .card-header
    let titleCell;
    const header = card.querySelector('.card-header');
    if (header) {
      const heading = header.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        // Use the heading element directly
        titleCell = heading;
      } else {
        // If heading missing, use header as is
        titleCell = header;
      }
    } else {
      // fallback: empty cell
      titleCell = document.createElement('div');
    }

    // Content cell: .collapse > .card-body, else .collapse, else empty
    let contentCell;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        contentCell = collapse;
      }
    } else {
      // fallback: empty div
      contentCell = document.createElement('div');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
