/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column with the block name
  const headerRow = ['Columns (columns21)'];

  // Content row: each <a> is a column cell
  const links = Array.from(element.querySelectorAll('a'));
  // Defensive: if no links, put the whole element in a single cell
  const contentRow = links.length > 0 ? links : [element];

  // Compose cells with single header cell and as many columns as needed in the second row
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
