/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const cells = [['Embed']];
  // Gather all direct text and element children
  const content = [];
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      content.push(document.createTextNode(node.textContent));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'iframe' && node.src) {
        // Per spec: Use a link to the iframe src
        const link = document.createElement('a');
        link.href = node.src;
        link.textContent = node.src;
        content.push(link);
      } else {
        content.push(node);
      }
    }
  });
  // Add content as a single cell in the second row
  cells.push([content]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
