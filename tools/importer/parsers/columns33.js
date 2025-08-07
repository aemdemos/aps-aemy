/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns: .media-body (content), .media-right (image)
  let mediaBody = null;
  let mediaRight = null;
  for (const child of element.children) {
    if (child.classList.contains('media-body')) mediaBody = child;
    if (child.classList.contains('media-right')) mediaRight = child;
  }
  // Compose the table so the header row is a single column, and the second row is two columns
  const headerRow = ['Columns (columns33)'];
  const contentRow = [mediaBody, mediaRight].filter(Boolean); // Only include non-null columns
  if (contentRow.length === 0) return;
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
