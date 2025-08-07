/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we use the correct header as in the example
  const headerRow = ['Accordion (accordion19)'];

  // Find all immediate children .card elements (one per accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Each card -> [title cell, content cell]
  const rows = cards.map(card => {
    // Title: from .card-header's heading child or its textContent if not present
    let titleEl = card.querySelector('.card-header');
    let titleContent = '';
    if (titleEl) {
      // Prefer h2/h3/h4/etc inside titleEl for semantic heading, else the titleEl itself
      let heading = titleEl.querySelector('h1,h2,h3,h4,h5,h6');
      titleContent = heading ? heading : titleEl;
    }
    // Content: .card-body inside .collapse, fallback to .collapse, else blank
    let collapse = card.querySelector('.collapse');
    let contentEl = '';
    if (collapse) {
      let body = collapse.querySelector('.card-body');
      contentEl = body ? body : collapse;
    }
    return [titleContent, contentEl];
  });

  // Compose the cells and create the block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}