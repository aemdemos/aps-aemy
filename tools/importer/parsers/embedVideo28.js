/* global WebImporter */
export default function parse(element, { document }) {
  // Compose content for the Embed block: all direct children, including text nodes
  const cellContent = [];
  // Get all child nodes (text and elements)
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent.trim();
      if (txt) {
        cellContent.push(document.createTextNode(txt));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'iframe' && node.src) {
        // Convert iframe to link per requirements
        const link = document.createElement('a');
        link.href = node.src;
        link.textContent = node.src;
        cellContent.push(link);
      } else {
        cellContent.push(node);
      }
    }
  });

  // Build the table: 1 column, 2 rows, header is exactly 'Embed'
  const cells = [
    ['Embed'],
    [cellContent.length === 1 ? cellContent[0] : cellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
