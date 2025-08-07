/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion12) block table
  // Header row as specified in the example
  const headerRow = ['Accordion (accordion12)'];

  // Get the accordion title element (prefer heading, else fallback to header div text)
  let titleCell = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    // Take the first heading element if present
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // If no heading, use the contents of headerDiv
      titleCell = document.createElement('div');
      Array.from(headerDiv.childNodes).forEach(node => titleCell.appendChild(node.cloneNode(true)));
    }
  }

  // Get the accordion content element (body)
  let contentCell = '';
  const bodyDiv = element.querySelector('.card-body');
  if (bodyDiv) {
    // Reference the bodyDiv directly (do not clone)
    contentCell = bodyDiv;
  }

  // Construct the rows: [header], [title, content]
  const rows = [
    headerRow,
    [titleCell, contentCell],
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
