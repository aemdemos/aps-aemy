/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell (spanning two columns in effect)
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Each .card is an accordion item
  const cards = element.querySelectorAll(':scope > .card');
  // For each item, push [title, content] as a row
  cards.forEach((card) => {
    // Title cell: heading if present, otherwise .card-header text
    let titleCell = '';
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        titleCell = document.createTextNode(cardHeader.textContent.trim());
      }
    }
    // Content cell: .card-body as element if present
    let contentCell = '';
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create a table with the rows (header row = 1 cell, others = 2 cells)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
