/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as a single-cell row
  const headerRow = ['Accordion (accordion36)'];

  // Get the accordion title
  let title = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    title = heading ? heading.textContent.trim() : headerDiv.textContent.trim();
  }

  // Get the content for the accordion
  let contentElem = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    contentElem = collapseDiv.querySelector('.card-body') || collapseDiv;
  }
  if (!contentElem) contentElem = element;

  // Each item is a row: [title, contentElem]
  const rows = [[title, contentElem]];

  // The block table: header row is always a single cell
  const cells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
