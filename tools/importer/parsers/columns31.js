/* global WebImporter */
export default function parse(element, { document }) {
  // The Columns block always has this header
  const headerRow = ['Columns (columns31)'];

  // Get the two main columns by their known classes
  const firstCol = element.querySelector('.code_snippet_first');
  const secondCol = element.querySelector('.code_snippet_second');

  // Defensive: If columns are missing, fallback to an empty div to preserve cell count
  const firstColContent = firstCol ? firstCol : document.createElement('div');
  const secondColContent = secondCol ? secondCol : document.createElement('div');

  // Compose the cells for the block table as per guidelines
  const cells = [
    headerRow,
    [firstColContent, secondColContent],
  ];

  // Create and replace with the structured table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
