/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Extract accordion title from .card-header (prefer heading)
  let titleCell = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    // Look for a heading inside the header (h1-h6)
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // fallback: use header div itself
      titleCell = headerDiv;
    }
  }

  // Extract content cell from .collapse > .card-body
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    // Prefer the .card-body div inside collapse
    const bodyDiv = collapseDiv.querySelector('.card-body');
    if (bodyDiv) {
      contentCell = bodyDiv;
    } else {
      // fallback: use collapseDiv
      contentCell = collapseDiv;
    }
  }

  // Only add the accordion row if both a title and content are present
  if (titleCell && contentCell) {
    rows.push([titleCell, contentCell]);
  }

  // Create and replace with the Accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
