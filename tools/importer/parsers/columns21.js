/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell containing the block name exactly
  const headerRow = ['Columns (columns21)'];

  // Extract all links (columns) as cells for the second row
  const links = Array.from(element.querySelectorAll('a'));

  // The cells array: header is a single cell, second row contains one cell for each button
  const cells = [headerRow, links];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
