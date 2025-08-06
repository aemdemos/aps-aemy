/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row for the Accordion block
  const headerRow = ['Accordion (accordion22)'];
  const rows = [headerRow];

  // Get all direct child .card elements (accordion items)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: Find the .card-header and use its content, preferring <h2> if present
    let titleEl = card.querySelector('.card-header h2') || card.querySelector('.card-header');
    let titleCell;
    if (titleEl) {
      titleCell = titleEl;
    } else {
      titleCell = document.createTextNode('');
    }

    // Content cell: .card-body; if missing, blank
    let contentEl = card.querySelector('.card-body');
    let contentCell = contentEl ? contentEl : document.createTextNode('');

    rows.push([titleCell, contentCell]);
  });

  // Build the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
