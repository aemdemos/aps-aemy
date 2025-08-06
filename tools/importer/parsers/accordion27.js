/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name, as per requirements
  const headerRow = ['Accordion (accordion27)'];
  const rows = [headerRow];

  // Find all cards (accordion items)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: Use .card-header. If .card-header contains h2, use h2 for better semantics.
    let titleElem = card.querySelector('.card-header h2');
    if (!titleElem) {
      titleElem = card.querySelector('.card-header');
    }

    // Content cell: .collapse > .card-body (may contain p, ul, etc.)
    const contentElem = card.querySelector('.collapse .card-body');

    // Only include row if BOTH titleElem and contentElem exist
    if (titleElem && contentElem) {
      rows.push([
        titleElem,
        contentElem
      ]);
    }
  });

  // Create the table using the specified helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with our table
  element.replaceWith(table);
}
