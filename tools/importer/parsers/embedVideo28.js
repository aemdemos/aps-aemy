/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the content for the block cell
  const content = [];
  const tableElement = element.querySelector('table');
  if (tableElement) {
    // Replace the <h4> element with its child table
    element.parentNode.replaceChild(tableElement, element);
    return;
  }
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'IFRAME' && node.src) {
        // Replace iframe (non-img) with a link
        const link = document.createElement('a');
        link.href = node.src;
        link.textContent = node.src;
        content.push(link);
      } else {
        content.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Add any text content present directly under the element
      const txt = node.textContent.trim();
      if (txt) {
        content.push(txt);
      }
    }
  });

  // Construct the cells array as per the markdown example
  const cells = [
    ['Embed'], // EXACT header from example
    [content] // All source content, preserving semantic meaning
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
