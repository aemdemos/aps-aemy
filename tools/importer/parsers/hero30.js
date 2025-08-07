/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all content from the element, including text and links
  // For this HTML, the element is a <p> with text and an <a> (CTA button)
  // To ensure all content is preserved, move child nodes into a div
  const contentDiv = document.createElement('div');
  while (element.firstChild) {
    contentDiv.appendChild(element.firstChild);
  }

  // Build table structure: header, background image (empty), content
  const cells = [
    ['Hero'],
    [''],
    [contentDiv]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}