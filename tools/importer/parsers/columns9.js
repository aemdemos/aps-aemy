/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exactly one cell, as required
  const headerRow = ['Columns (columns9)'];

  // Find the main paragraph containing the buttons/links
  const p = element.querySelector('p');
  // Get all <a> tags inside the paragraph
  const links = p ? Array.from(p.querySelectorAll('a')) : [];

  // Second row: one column per link (<a>), as shown in the markdown example
  const contentRow = links.map(link => link);
  // If there are fewer than 2 links, fill with empty cells to ensure at least 2 columns
  while (contentRow.length < 2) {
    contentRow.push('');
  }

  // Build the table structure: first row is one cell, second row has N columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
