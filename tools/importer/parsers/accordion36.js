/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in requirements
  const headerRow = ['Accordion (accordion36)'];

  // Get the title from the .card-header > heading element (reference the actual element)
  let titleElement = null;
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    titleElement = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    // If for some reason no heading, fallback to cardHeader itself
    if (!titleElement) titleElement = cardHeader;
  } else {
    // Fallback: use text node
    titleElement = document.createElement('div');
    titleElement.textContent = element.textContent.trim();
  }

  // Get the content from .collapse > .card-body (reference, do not clone)
  let contentElement = null;
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    const cardBody = collapse.querySelector('.card-body');
    contentElement = cardBody || collapse;
  } else {
    // Fallback: everything except card-header
    contentElement = document.createElement('div');
    Array.from(element.children).forEach(child => {
      if (!child.classList.contains('card-header')) {
        contentElement.appendChild(child);
      }
    });
  }

  // Compose table rows
  const tableRows = [
    headerRow,
    [titleElement, contentElement]
  ];

  // Create the block table using referenced nodes
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
