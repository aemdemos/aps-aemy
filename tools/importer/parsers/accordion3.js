/* global WebImporter */
export default function parse(element, { document }) {
  // This function creates a 2-column accordion block table
  // Each row after the header is [title, content] for each accordion section
  // The header row matches the block name exactly

  // Get all .card elements - either in .accordion or as standalone .card
  let cards = [];
  if (element.classList.contains('card')) {
    cards = [element];
  } else {
    cards = Array.from(element.querySelectorAll(':scope > .card'));
    // Fallback if the element itself is a card and not in an accordion
    if (!cards.length && element.classList.contains('card')) {
      cards = [element];
    }
  }

  // Table rows: First row is header (block name), others are accordion items
  const rows = [['Accordion (accordion3)']];

  cards.forEach(card => {
    // Extract the title from card-header (usually h2/h3)
    const header = card.querySelector('.card-header');
    let titleElem = null;
    if (header) {
      // Find the first heading tag inside card-header
      titleElem = header.querySelector('h1, h2, h3, h4, h5, h6');
      if (!titleElem) titleElem = header; // fallback to header itself
    }

    // Extract the content from .collapse > .card-body
    let contentElem = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      contentElem = collapse.querySelector('.card-body');
      if (!contentElem) contentElem = collapse;
    }
    // Fallback to direct .card-body
    if (!contentElem) {
      contentElem = card.querySelector('.card-body');
    }

    // Defensive: If either titleElem or contentElem is missing, use empty string
    rows.push([
      titleElem || '',
      contentElem || ''
    ]);
  });

  // Create the block table with correct structure
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
