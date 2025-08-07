/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block with 2 columns: title and content
  // Header row must exactly match the required block name
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Defensive: get the title from the card-header
  let titleCell = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    // Use the first heading (strongest semantic match), or fallback to headerDiv's textContent
    const heading = headerDiv.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      titleCell = heading;
    } else if (headerDiv.textContent && headerDiv.textContent.trim()) {
      titleCell = headerDiv.textContent.trim();
    }
  }

  // Defensive: get the content (single cell) from card-body
  let contentCell = '';
  const bodyDiv = element.querySelector('.card-body');
  if (bodyDiv) {
    contentCell = bodyDiv;
  } else {
    // If for some reason, .card-body not found, find the first div after card-header
    const candidates = Array.from(element.children);
    const idx = candidates.indexOf(headerDiv);
    if (idx !== -1 && candidates.length > idx + 1) {
      contentCell = candidates[idx + 1];
    }
  }

  // Only add a row if there's at least a title
  if (titleCell) {
    rows.push([titleCell, contentCell]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
