/* global WebImporter */
export default function parse(element, { document }) {
  // Build the Hero block as a table
  // 1st row: header
  const headerRow = ['Hero'];
  // 2nd row: (optional) image row, empty as there is no image in the source
  const imageRow = [''];
  // 3rd row: main content (all content from the original element)
  // We want to preserve all text and child elements (such as the <a> button)
  const contentNodes = Array.from(element.childNodes);
  let content;
  if (contentNodes.length === 1) {
    content = contentNodes[0];
  } else {
    content = contentNodes;
  }
  const contentRow = [content];
  // Assemble and replace
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}