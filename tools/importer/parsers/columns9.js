/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single column with the block name
  const headerRow = ['Columns (columns9)'];

  // For this HTML, we want a content row with two columns, one per link
  const links = Array.from(element.querySelectorAll('a'));

  // Content row: each <a> as a column
  const contentRow = links;

  // Table is header + content row
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
