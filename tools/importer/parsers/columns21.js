/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all <a> elements from the given <p>
  const links = Array.from(element.querySelectorAll('a'));
  if (links.length === 0) return;
  // Header row: exactly one column, matching example
  const headerRow = ['Columns (columns21)'];
  // Data row: one column per link
  const linksRow = links;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    linksRow
  ], document);
  element.replaceWith(table);
}
