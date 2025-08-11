/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER: Must match exactly as in the example
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Find the accordion sections; in this HTML, it's a single card
  // Title cell: Use the h2 in .card-header
  let titleCell = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    const h2 = headerDiv.querySelector('h2');
    titleCell = h2 ? h2 : headerDiv;
  } else {
    titleCell = document.createTextNode('');
  }

  // Content cell: Use the .card-body inside .collapse
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const bodyDiv = collapseDiv.querySelector('.card-body');
    contentCell = bodyDiv ? bodyDiv : collapseDiv;
  } else {
    contentCell = document.createTextNode('');
  }

  // Add row for the accordion item
  rows.push([titleCell, contentCell]);

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
