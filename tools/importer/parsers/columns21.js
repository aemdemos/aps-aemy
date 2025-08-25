/* global WebImporter */
export default function parse(element, { document }) {
  // The first row must be a single cell header
  const headerRow = ['Columns (columns21)'];

  // Get all the links (each link is a column in the 2nd row)
  const links = Array.from(element.querySelectorAll('a'));
  // The second row is an array of each link as its own cell
  const columnsRow = links;

  const cells = [
    headerRow, // single cell header row
    columnsRow // columns row, as many columns as links
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}