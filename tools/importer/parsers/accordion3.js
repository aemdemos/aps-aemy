/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row, as per instructions
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Helper to extract the clickable title from .card-header
  function extractTitle(cardHeader) {
    // Prefer h2, but fallback to header's entire content
    const h2 = cardHeader.querySelector('h2');
    if (h2) return h2;
    // If h2 not found, just use the header itself
    return cardHeader;
  }

  // Find all the .card elements
  let cards;
  if (element.classList.contains('accordion')) {
    cards = Array.from(element.querySelectorAll(':scope > .card'));
  } else if (element.classList.contains('card')) {
    cards = [element];
  } else {
    // Supports edge case: element contains multiple .card children but isn't .accordion
    cards = Array.from(element.querySelectorAll(':scope > .card'));
  }

  // For each card, extract [title, content]
  cards.forEach(card => {
    // Title cell
    const cardHeader = card.querySelector('.card-header');
    let titleElem = cardHeader ? extractTitle(cardHeader) : document.createElement('span');

    // Content cell
    const collapse = card.querySelector('.collapse');
    let contentElem;
    if (collapse) {
      // Get .card-body if present, else whole collapse
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentElem = cardBody;
      } else {
        contentElem = collapse;
      }
    } else {
      // Edge case: no collapse, try .card-body in card
      const cardBody = card.querySelector('.card-body');
      contentElem = cardBody ? cardBody : document.createElement('span');
    }
    rows.push([titleElem, contentElem]);
  });

  // Build table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
