/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be EXACTLY one column
  const headerRow = ['Columns (columns21)'];

  // Gather all <a> links from the element for columns
  const links = Array.from(element.querySelectorAll('a'));
  // Second row: One cell for each link (3 columns)
  const contentRow = links;

  // Build cells array: header row is 1 column, content row is N columns
  const cells = [
    headerRow,    // ['Columns (columns21)']
    contentRow    // [<a>, <a>, <a>]
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
