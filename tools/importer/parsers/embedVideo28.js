/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the single cell for the block (preserving all content including text)
  const cellContent = [];
  // Iterate over all child nodes to preserve text and element order
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'IFRAME' && node.src) {
        // Replace iframe with a link to its src
        const link = document.createElement('a');
        link.href = node.src;
        link.textContent = node.src;
        cellContent.push(link);
      } else {
        // For other elements, preserve as-is
        cellContent.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Preserve non-empty text nodes
      cellContent.push(node.textContent.trim());
    }
  });
  // Ensure the cell is not empty
  if (cellContent.length === 0) {
    cellContent.push('');
  }
  // Create the Embed block table
  const cells = [
    ['Embed'],
    [cellContent.length === 1 ? cellContent[0] : cellContent],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
