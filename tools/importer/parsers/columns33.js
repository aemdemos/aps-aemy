/* global WebImporter */
export default function parse(element, { document }) {
  // Find left and right content columns
  const leftCol = element.querySelector('.media-body');
  const rightCol = element.querySelector('.media-right');

  // Defensive: fallback to empty divs if columns are missing
  const leftContent = leftCol || document.createElement('div');
  const rightContent = rightCol || document.createElement('div');

  // Header is one column only, as per the example
  const headerRow = ['Columns (columns33)'];
  // Content row is two columns (left and right)
  const contentRow = [leftContent, rightContent];

  // Compose the cells: first row = header (1 col), second row = content (2 cols)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
