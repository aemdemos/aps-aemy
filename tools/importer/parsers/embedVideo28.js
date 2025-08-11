/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const headerRow = ['Embed'];

  // Collect all direct child nodes (elements and text)
  const children = Array.from(element.childNodes);
  const cellContent = [];

  children.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      // For iframes, insert a link as required
      if (child.tagName === 'IFRAME' && child.src) {
        const linkEl = document.createElement('a');
        linkEl.href = child.src;
        linkEl.textContent = child.src;
        cellContent.push(linkEl);
      } else {
        // For any other element, include as-is to retain content
        cellContent.push(child);
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      // Ensure all text content is retained
      const txt = child.textContent.trim();
      if (txt) cellContent.push(txt);
    }
  });

  // If no children, fallback to overall textContent (edge case)
  if (cellContent.length === 0 && element.textContent.trim()) {
    cellContent.push(element.textContent.trim());
  }

  // Guarantee only one cell for the content row
  const cells = [
    headerRow,
    [cellContent.length === 1 ? cellContent[0] : cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
