/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell array
  const rows = [['Accordion (accordion15)']];

  // Extract the title (from .card-header)
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Use the original heading if present, else the cardHeader itself
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    titleCell = heading ? heading : cardHeader;
  } else {
    const emptySpan = document.createElement('span');
    emptySpan.textContent = '';
    titleCell = emptySpan;
  }

  // Extract the content (from .card-body or .collapse)
  let contentCell = '';
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    const cardBody = collapse.querySelector('.card-body');
    contentCell = cardBody ? cardBody : collapse;
  } else {
    const emptySpan = document.createElement('span');
    emptySpan.textContent = '';
    contentCell = emptySpan;
  }

  // Push row: exactly two cells (title, content)
  rows.push([titleCell, contentCell]);

  // Construct and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
