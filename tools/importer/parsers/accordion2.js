/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the accordion block table
  const headerRow = ['Accordion (accordion2)'];

  // --- Extract the title (always present) ---
  // Find the card header (the clickable area)
  let cardHeader = element.querySelector('.card-header');
  let titleElem;
  if (cardHeader) {
    // Find the heading inside the card-header
    titleElem = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (!titleElem) {
      // If no heading, use the text inside the card-header (ensure not empty)
      let headerText = cardHeader.textContent.trim();
      titleElem = document.createElement('span');
      titleElem.textContent = headerText;
    }
  } else {
    // Fallback: no card-header, use empty string in span
    titleElem = document.createElement('span');
    titleElem.textContent = '';
  }

  // --- Extract the content (always present) ---
  // The accordion body content is inside .collapse .card-body
  let cardBody = element.querySelector('.collapse .card-body');
  let contentElem;
  if (cardBody) {
    contentElem = cardBody;
  } else {
    // Fallback: collapse itself may have direct contents
    let collapseDiv = element.querySelector('.collapse');
    if (collapseDiv) {
      contentElem = collapseDiv;
    } else {
      // Fallback: empty div
      contentElem = document.createElement('div');
    }
  }

  // --- Construct the block table ---
  const tableRows = [
    headerRow,
    [titleElem, contentElem]
  ];

  // --- Replace the original element with the new block table ---
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
