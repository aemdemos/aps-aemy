/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW - block name exactly as in requirements
  const headerRow = ['Accordion (accordion4)'];
  const cells = [headerRow];

  // Get all accordion cards (immediate .card children)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  cards.forEach(card => {
    // Title cell extraction
    // Prefer h2/h5 inside .card-header, else fallback to full .card-header
    let titleElem = card.querySelector('.card-header h2, .card-header h5');
    if (!titleElem) {
      const header = card.querySelector('.card-header');
      // create a div to reference the header text if h2/h5 missing
      titleElem = document.createElement('div');
      if (header) titleElem.textContent = header.textContent.trim();
    }
    // Content cell: reference the full .card-body (preserves nested elements)
    const contentElem = card.querySelector('.card-body');
    // If no .card-body, fallback to empty div
    cells.push([
      titleElem,
      contentElem || document.createElement('div')
    ]);
  });

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}