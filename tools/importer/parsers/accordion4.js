/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion4) block header row
  const headerRow = ['Accordion (accordion4)'];
  // Gather all direct .card children (each is one accordion item)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];
  cards.forEach((card) => {
    // Title cell extraction: find .card-header > heading element (h2, h3, h4, h5, h6)
    let titleEl = null;
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      // Try to find a heading tag in .card-header
      titleEl = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      // If not, fallback to cardHeader itself
      if (!titleEl) {
        titleEl = cardHeader;
      }
    } else {
      // If no card-header, fallback to first child
      titleEl = card.firstElementChild;
    }

    // Content cell extraction: find .collapse > .card-body
    let contentEl = null;
    const collapseEl = card.querySelector(':scope > .collapse');
    if (collapseEl) {
      contentEl = collapseEl.querySelector(':scope > .card-body') || collapseEl;
    } else {
      // If no .collapse, try next sibling or fallback to card
      contentEl = card;
    }
    
    // Push the row as [title, content] referencing actual elements
    rows.push([titleEl, contentEl]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
