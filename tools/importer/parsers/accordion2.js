/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row with exact block name
  const headerRow = ['Accordion (accordion2)'];

  // 2. Extract title/content for the accordion item
  // Title: Find .card-header > heading (keep reference), fallback to .card-header content
  let titleCell;
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Try to find heading inside .card-header
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // Fallback to entire .card-header (keep reference)
      titleCell = cardHeader;
    }
  } else {
    // Fallback: empty title
    titleCell = document.createElement('div');
  }

  // Content: Use .card-body (keep reference)
  let contentCell;
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    contentCell = cardBody;
  } else {
    // Fallback: empty cell
    contentCell = document.createElement('div');
  }

  // 3. Build table rows
  const tableData = [headerRow, [titleCell, contentCell]];

  // 4. Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // 5. Replace element with block
  element.replaceWith(block);
}
