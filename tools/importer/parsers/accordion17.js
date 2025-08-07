/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const rows = [['Accordion (accordion17)']];

  // Accordion items: each .card in the element
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title: Use .card-header > h2 (if present), else .card-header
    let titleEl;
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        titleEl = h2;
      } else {
        titleEl = header;
      }
    } else {
      titleEl = document.createTextNode(''); // fallback
    }

    // Content: Use the whole .card-body if present
    let contentEl;
    const body = card.querySelector('.card-body');
    if (body) {
      contentEl = body;
    } else {
      contentEl = document.createTextNode(''); // fallback
    }

    rows.push([titleEl, contentEl]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element
  element.replaceWith(blockTable);
}
