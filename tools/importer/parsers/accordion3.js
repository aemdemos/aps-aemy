/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header, matches example exactly
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Get all direct .card children (each card = 1 accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach(card => {
    // Title cell: use the heading from the card-header
    let titleElem = null;
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Find the strongest heading or fallback to text
      const heading = header.querySelector('h1, h2, h3, h4, h5, h6, .h6');
      if (heading) {
        // Use the existing heading element (do not clone, reference directly)
        titleElem = heading;
      } else {
        // fallback: create a <span> referencing the header's text
        titleElem = document.createElement('span');
        titleElem.textContent = header.textContent.trim();
      }
    } else {
      // fallback: use empty cell
      titleElem = document.createElement('span');
    }
    // Content cell: use the .card-body inside the .collapse
    let contentElem = null;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const body = collapse.querySelector(':scope > .card-body');
      if (body) {
        contentElem = body;
      } else {
        // fallback: reference collapse div
        contentElem = collapse;
      }
    } else {
      // fallback: empty
      contentElem = document.createElement('span');
    }
    rows.push([
      titleElem,
      contentElem
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
