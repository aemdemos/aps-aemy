/* global WebImporter */
export default function parse(element, { document }) {
  // Collect immediate children, including text nodes
  const contentNodes = Array.from(element.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) return false;
    return true;
  });

  const cellContent = [];
  contentNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Only include non-empty text nodes
      if (node.textContent.trim()) {
        cellContent.push(document.createTextNode(node.textContent));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'IFRAME' && node.src) {
        // Replace iframe with a link to the src
        const link = document.createElement('a');
        link.href = node.src;
        link.textContent = node.src;
        cellContent.push(link);
      } else {
        cellContent.push(node);
      }
    }
  });

  // If cellContent is empty, ensure table is still structurally correct
  const cell = cellContent.length === 0 ? document.createTextNode('')
               : cellContent.length === 1 ? cellContent[0]
               : cellContent;

  const cells = [
    ['Embed'],
    [cell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
