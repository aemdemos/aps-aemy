/* global WebImporter */
export default function parse(element, { document }) {
  // Get left and right columns
  const left = element.querySelector('.media-body');
  const right = element.querySelector('.media-right');

  // Extract left column content
  const leftParts = [];
  if (left) {
    Array.from(left.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        leftParts.push(node);
      }
    });
  }

  // Extract right column content
  const rightParts = [];
  if (right) {
    Array.from(right.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        rightParts.push(node);
      }
    });
  }

  // Ensure two columns, matching the columns33 example block
  // The header row must have two cells: ['Columns (columns33)', '']
  const headerRow = ['Columns (columns33)', ''];
  const row = [leftParts.length === 1 ? leftParts[0] : leftParts, rightParts.length === 1 ? rightParts[0] : rightParts];
  const cells = [headerRow, row];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
