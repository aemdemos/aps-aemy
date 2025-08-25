/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all immediate children and text nodes for the cell
  const cellContent = [];
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'iframe' && node.hasAttribute('src')) {
        // Replace iframe with a link to its src
        const a = document.createElement('a');
        a.href = node.src;
        a.textContent = node.src;
        cellContent.push(a);
      } else {
        cellContent.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim() !== '') {
        cellContent.push(node.textContent);
      }
    }
  });
  // Ensure the cell is not empty
  const contentRow = [cellContent.length ? cellContent : ['']];
  const cells = [
    ['Embed'],
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}