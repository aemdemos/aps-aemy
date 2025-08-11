/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Accordion (accordion15)'];

  // Find the card-header (title area)
  const headerDiv = Array.from(element.children).find((child) => child.classList.contains('card-header'));
  let title = '';
  if (headerDiv) {
    // Take the text content of the heading, or fallback to whole headerDiv text
    const h2 = headerDiv.querySelector('h2, .h6');
    title = h2 ? h2.textContent.trim() : headerDiv.textContent.trim();
  }

  // Find the collapse/body area
  const collapseDiv = Array.from(element.children).find((child) => child.classList.contains('collapse'));
  let contentBody = null;
  if (collapseDiv) {
    // Get the card-body container, or use the collapse div directly
    const cardBody = collapseDiv.querySelector('.card-body') || collapseDiv;
    // Reference the full block content here, including existing table
    contentBody = cardBody;
  }

  // Prepare the main accordion row using references
  const rows = [headerRow, [title, contentBody]];

  // Build the new block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
