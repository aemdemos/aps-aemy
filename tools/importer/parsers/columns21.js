/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single column, exactly as in the example
  const headerRow = ['Columns (columns21)'];

  // Gather all direct anchor children in the <p>
  const links = Array.from(element.querySelectorAll('a'));

  // Edge case: If no links, don't replace
  if (links.length === 0) return;

  // Table's second row: each link gets its own column
  const row = links;

  // Structure: headerRow is a single-cell array, row is a multi-cell array
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
