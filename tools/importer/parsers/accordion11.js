/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Accordion block header row
  const headerRow = ['Accordion (accordion11)'];
  const rows = [];

  // 2. Each immediate child .card is an accordion item
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title: Take heading (h1-h6) if found in card-header, else card-header itself
    let cardHeader = card.querySelector('.card-header');
    let titleEl = null;
    if (cardHeader) {
      // Prefer heading element if there is one
      titleEl = cardHeader.querySelector('h1, h2, h3, h4, h5, h6') || cardHeader;
    }
    // Defensive: if missing, use empty placeholder
    if (!titleEl) {
      titleEl = document.createElement('span');
    }
    // Content: main .card-body within the .collapse
    let contentEl = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      // Prefer .card-body, but if not present, use .collapse itself
      contentEl = collapse.querySelector('.card-body') || collapse;
    }
    // Defensive: if content still missing, create empty placeholder
    if (!contentEl) {
      contentEl = document.createElement('div');
    }
    // Add the row [title, content]
    rows.push([titleEl, contentEl]);
  });

  // 3. Create the table (header row, then each accordion item row)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  
  // 4. Replace the original element
  element.replaceWith(table);
}
