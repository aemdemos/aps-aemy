/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion15)'];

  // Get the accordion title from the .card-header > h2 (or textContent if no heading)
  let title = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      title = heading.textContent.trim();
    } else {
      title = cardHeader.textContent.trim();
    }
  }

  // Get the content from the card-body inside .collapse
  let contentElem = null;
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    contentElem = collapse.querySelector('.card-body');
  }
  // Fallback: if no card-body, use .collapse
  if (!contentElem && collapse) {
    contentElem = collapse;
  }
  // If still none, fallback to empty div
  if (!contentElem) {
    contentElem = document.createElement('div');
  }

  // Build the accordion block rows
  const cells = [
    headerRow,
    [title, contentElem]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
