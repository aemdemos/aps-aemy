/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as specified in the markdown example
  const headerRow = ['Accordion (accordion36)'];

  // Get the title element from the card header
  const headerDiv = element.querySelector('.card-header');
  let titleElem = null;
  if (headerDiv) {
    // Look for a heading (h2-h6), fallback to headerDiv itself if none
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleElem = heading;
    } else {
      titleElem = headerDiv;
    }
  }

  // Get the content element from within the collapse div
  let contentElem = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    // Prefer .card-body inside collapse, otherwise use collapseDiv directly
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentElem = cardBody;
    } else {
      contentElem = collapseDiv;
    }
  }

  // If either title or content is missing, do not add the row
  const rows = [headerRow];
  if (titleElem && contentElem) {
    rows.push([titleElem, contentElem]);
  }

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
