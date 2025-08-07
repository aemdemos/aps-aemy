/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as specified
  const rows = [['Accordion (accordion29)']];

  // 2. Get all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Find title element
    let titleEl = null;
    const header = card.querySelector('.card-header');
    if (header) {
      // Use the first heading (h2/h3/h4) inside header if available, else the header itself
      titleEl = header.querySelector('h1, h2, h3, h4, h5, h6') || header;
    } else {
      // fallback: empty span
      titleEl = document.createElement('span');
      titleEl.textContent = '';
    }

    // Find content/body element
    let contentEl = null;
    // Prefer .card-body, fall back to collapse div
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      contentEl = cardBody || collapse;
    } else {
      // fallback: empty div
      contentEl = document.createElement('div');
    }

    // Add row [title, content]
    rows.push([titleEl, contentEl]);
  });

  // 3. Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 4. Replace the element with the new block
  element.replaceWith(block);
}
