/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all direct child nodes, including text, to preserve all content
  const cellContent = [];
  element.childNodes.forEach(node => {
    // Text content
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        cellContent.push(document.createTextNode(text));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // For iframe: replace with a link using its src (per block rules)
      if (node.tagName === 'IFRAME' && node.src) {
        const link = document.createElement('a');
        link.href = node.src;
        link.textContent = node.src;
        cellContent.push(link);
      } else {
        // Other element nodes are included as-is
        cellContent.push(node);
      }
    }
  });

  if (cellContent.length === 0) {
    // Defensive: fallback if block is empty
    cellContent.push(document.createTextNode(''));
  }

  const cells = [
    ['Embed'],
    [cellContent]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
