/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header (must match the example exactly)
  const headerRow = ['Accordion (accordion4)'];

  // Get all accordion panels/cards
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach((card) => {
    // Title cell extraction: get the direct heading inside the card-header
    let titleCell = '';
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // The heading is typically an h2-h6 inside header
      const heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // fallback: use header text node (ensure HTML, not markdown)
        const span = document.createElement('span');
        span.textContent = header.textContent.trim();
        titleCell = span;
      }
    } else {
      // fallback in case header is missing
      const emptySpan = document.createElement('span');
      titleCell = emptySpan;
    }

    // Content cell: everything inside .collapse > .card-body
    let contentCell = '';
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        // fallback: empty cell
        const emptySpan = document.createElement('span');
        contentCell = emptySpan;
      }
    } else {
      // fallback: empty cell
      const emptySpan = document.createElement('span');
      contentCell = emptySpan;
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
