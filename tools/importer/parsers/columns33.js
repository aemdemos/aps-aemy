/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we robustly extract the two column elements
  let mediaBody = element.querySelector('.media-body');
  let mediaRight = element.querySelector('.media-right');

  // Edge case handling: if one is missing, create an empty div so columns align
  if (!mediaBody) {
    mediaBody = document.createElement('div');
  }
  if (!mediaRight) {
    mediaRight = document.createElement('div');
  }

  // The header must match the block name exactly
  const headerRow = ['Columns (columns33)'];

  // The second row: each cell is a column. Reference the extracted elements directly.
  const contentRow = [mediaBody, mediaRight];

  // Compose the table
  const cells = [
    headerRow,
    contentRow,
  ];

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
