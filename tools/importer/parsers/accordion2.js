/* global WebImporter */
export default function parse(element, { document }) {
  // Extract accordion title
  let titleElem = null;
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    titleElem = cardHeader.querySelector('h1, h2, h3, h4, h5, h6') || cardHeader.firstElementChild || cardHeader;
  }

  // Extract accordion content
  let contentElem = null;
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    contentElem = cardBody;
  }

  // Build table rows
  const cells = [];

  // Header row: one cell with colspan=2
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Accordion (accordion2)';
  headerCell.colSpan = 2;
  const headerRow = [headerCell];
  cells.push(headerRow);

  // Accordion item row: [title, content]
  if (titleElem && contentElem) {
    cells.push([titleElem, contentElem]);
  }

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
