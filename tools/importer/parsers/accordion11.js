/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion11) block: extract all immediate child .card elements as rows.
  const headerRow = ['Accordion (accordion11)'];
  const rows = [headerRow];

  // Find all direct child .card elements (1 per accordion item)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // TITLE cell: find the heading inside .card-header (could be h2/h3/etc), or fallback to .card-header
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      // Find the heading (h2/h3/h4/etc) inside header
      const heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // fallback: use the header as is
        titleCell = header;
      }
    }

    // CONTENT cell: find .collapse > .card-body, or fallback to .collapse, or empty string
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        contentCell = collapse;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
