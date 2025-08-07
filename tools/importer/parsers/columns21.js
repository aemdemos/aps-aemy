/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;
  // Get all links inside the element
  const links = Array.from(element.querySelectorAll('a'));
  if (links.length === 0) return;

  // Construct the table:
  // Header row: exactly one cell
  // Second row: one cell for each link (column)
  const cells = [
    ['Columns (columns21)'],
    links
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}