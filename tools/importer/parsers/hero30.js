/* global WebImporter */
export default function parse(element, { document }) {
  // Create the Hero block header
  const headerRow = ['Hero'];

  // Second row: Background image - none in this case
  const bgRow = [''];

  // Third row: Content
  // Since the element could contain both text and elements, and to maximize flexibility,
  // we use all child nodes (including text nodes and elements) directly in the cell.
  // This way, if the structure changes, it will still include all visible content.
  const contentNodes = Array.from(element.childNodes).filter(n => {
    // Only keep real content: text nodes with non-whitespace and all elements
    return (n.nodeType === Node.ELEMENT_NODE) || (n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  });
  const contentRow = [contentNodes.length === 1 ? contentNodes[0] : contentNodes];

  // Compose block table
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block table
  element.replaceWith(table);
}
