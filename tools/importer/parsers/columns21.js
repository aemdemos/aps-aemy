/* global WebImporter */
export default function parse(element, { document }) {
  // Get all <a> elements (columns)
  const links = Array.from(element.querySelectorAll('a'));
  if (!links.length) return;

  // We want the header row to be a single cell/column, even if we have several in the content row
  const headerRow = ['Columns (columns21)'];
  // Content row: one <a> per column
  const contentRow = links;

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // After createTable, set the header row to have a single <th> with correct colspan
  // This ensures the header visually spans all columns in the HTML
  const rows = table.querySelectorAll('tr');
  if (rows.length >= 2) {
    const headerThs = rows[0].querySelectorAll('th');
    if (headerThs.length === 1 && contentRow.length > 1) {
      headerThs[0].setAttribute('colspan', String(contentRow.length));
    }
  }
  
  element.replaceWith(table);
}
