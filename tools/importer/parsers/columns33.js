/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block
  const headerRow = ['Columns (columns33)'];

  // Find the left and right main columns
  // Left: .media-body (contains title, description, details)
  const leftCol = element.querySelector('.media-body');
  // Right: .media-right img (the image)
  const rightColImg = element.querySelector('.media-right img');
  // Defensive fallback: ensure rightColImg is included as null if not found

  // Build columns: left = all of .media-body, right = image (if present)
  const row = [leftCol, rightColImg ? rightColImg : ''];

  // Compose table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}