/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row exactly as required
  const headerRow = ['Accordion (accordion27)'];

  // Get all accordion cards (each one is an item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Each row: [title cell, content cell]
  const rows = cards.map(card => {
    // Title cell: Use heading if present, else all card-header content
    const header = card.querySelector('.card-header');
    let titleContent = null;
    if (header) {
      const h2 = header.querySelector('h2, h3, h4, h5, h6');
      titleContent = h2 ? h2 : header;
    }

    // Content cell: Use .card-body if present, else the .collapse div
    let contentCell = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      contentCell = body ? body : collapse;
    } else {
      // If there's no .collapse, try to use the remaining content
      contentCell = card;
    }

    return [titleContent, contentCell];
  });

  // Build table
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
