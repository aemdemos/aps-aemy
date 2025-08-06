/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: must be a single cell according to the example
  const headerRow = ['Columns (columns21)'];

  // Collect all <a> elements within the given element, each should be a column
  const links = Array.from(element.querySelectorAll('a'));

  // If there are no links, don't create the block
  if (links.length === 0) return;

  // The second row is one cell per link
  const columnsRow = links;

  // Compose the table: first row is header (single cell), second row is columns (one cell per link)
  const cells = [
    headerRow,    // [ 'Columns (columns21)' ]
    columnsRow    // [link1, link2, link3]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
