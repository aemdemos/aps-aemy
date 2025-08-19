/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Embed'];

  // Prepare cell content array
  const cellContents = [];

  // Collect all text nodes and element nodes (including iframe) under the element
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Keep non-empty text content
      const text = node.textContent.trim();
      if (text) {
        cellContents.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IFRAME') {
      // For iframes, per requirements, use their src as a link
      const url = node.getAttribute('src');
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        cellContents.push(link);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Any other element: include it directly (retains existing references)
      cellContents.push(node);
    }
  });

  // Ensure at least an empty string if no content was found
  if (cellContents.length === 0) cellContents.push('');

  // Compose final table structure: header and single cell
  const cells = [
    headerRow,
    [cellContents.length === 1 ? cellContents[0] : cellContents],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
