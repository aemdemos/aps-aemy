/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified in the example
  const headerRow = ['Accordion (accordion23)'];

  // Gather all accordion items (assume .card per Bootstrap style)
  const cards = element.querySelectorAll(':scope > .card');

  const rows = [headerRow];

  cards.forEach((card) => {
    // TITLE CELL
    // Try to extract the heading from .card-header (look for heading element, fallback to text content)
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      const heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      titleCell = heading ? heading : header;
    }
    // CONTENT CELL
    // Extract the content from .collapse > .card-body (if present)
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        contentCell = body;
      } else {
        contentCell = collapse;
      }
    }
    // Add row if both title and content exist
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
