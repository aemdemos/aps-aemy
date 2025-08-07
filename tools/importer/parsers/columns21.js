/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row (exactly one column)
  const headerRow = ['Columns (columns21)'];

  // Get all <a> elements (the content for each column)
  const links = Array.from(element.querySelectorAll('a'));

  // Each link goes into its own cell in the content row
  const contentRow = links;

  // Compose the table rows: header is always a single cell, content row is N columns
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
