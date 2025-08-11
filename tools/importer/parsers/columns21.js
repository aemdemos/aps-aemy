/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single column as per example
  const headerRow = ['Columns (columns21)'];
  // Extract all <a> elements from within element
  const links = Array.from(element.querySelectorAll('a'));
  // Second row: each link is a column in this row (array of elements)
  const contentRow = links;
  // Compose the cells array: header is single column, content row is multiple columns
  const cells = [headerRow, contentRow];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}