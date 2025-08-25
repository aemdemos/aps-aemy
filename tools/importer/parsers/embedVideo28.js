/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as in the example
  const headerRow = ['Embed'];

  // Gather all relevant content from the element: both text and non-img elements (iframe, etc)
  const cellContent = [];
  // Edge case: if block contains text nodes or other inline content, include all
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'IFRAME') {
        // Convert iframes to links with href = src
        if (node.src) {
          const linkEl = document.createElement('a');
          linkEl.href = node.src;
          linkEl.textContent = node.src;
          cellContent.push(linkEl);
        }
      } else {
        // Include any other elements as-is
        cellContent.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        cellContent.push(text);
      }
    }
  });

  // Fallback to empty string if no content found
  const contentRow = [cellContent.length ? cellContent : ['']];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
