/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches exactly
  const headerRow = ['Accordion (accordion2)'];

  // 2. Get the accordion title: it's the h2 within .card-header
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const h2 = cardHeader.querySelector('h2');
    if (h2) {
      titleCell = h2;
    } else {
      // fallback if h2 is missing, use the whole cardHeader
      titleCell = cardHeader;
    }
  }

  // 3. Get the accordion content: everything in .collapse > .card-body
  let contentCell = '';
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    // If there's a .card-body, use it; otherwise .collapse itself
    const cardBody = collapse.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    } else {
      contentCell = collapse;
    }
  }

  // 4. Assemble rows for createTable
  const cells = [
    headerRow,
    [titleCell, contentCell],
  ];

  // 5. Create the accordion block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
