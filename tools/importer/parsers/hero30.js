/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: EXACT block name
  const headerRow = ['Hero'];
  // 2. Background image row: none in this input
  const backgroundImageRow = [''];
  // 3. Content row: all text and element content from the provided HTML
  // Collect all child nodes from the element (to include text and links)
  const cellContent = [];
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent.trim();
      if (txt) {
        // Wrap text in a span to preserve it as an element
        const span = document.createElement('span');
        span.textContent = txt;
        cellContent.push(span);
      }
    }
  });
  // If the element is empty or all whitespace, fallback to including element itself
  const contentRow = [cellContent.length ? cellContent : element];
  // Build the table structure
  const cells = [headerRow, backgroundImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
