/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, first row is header, each additional row per accordion item
  const rows = [
    ['Accordion (accordion4)'],
  ];

  // Find all direct .card children (each is an accordion item)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach((card) => {
    // Title cell: .card-header > h* (if present) or .card-header itself
    let cardHeader = card.querySelector(':scope > .card-header');
    // Defensive: header could be missing
    let titleElem = cardHeader;
    if (cardHeader) {
      let heading = cardHeader.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleElem = heading;
      }
    }

    // Content cell: find the .collapse and within it the .card-body
    let collapse = card.querySelector(':scope > .collapse');
    let contentElem = null;
    if (collapse) {
      // Use .card-body if present, else the entire collapse div
      let cardBody = collapse.querySelector(':scope > .card-body');
      contentElem = cardBody || collapse;
    }

    // Add row only if a title is found
    if (titleElem && contentElem) {
      rows.push([
        titleElem,
        contentElem
      ]);
    }
  });

  // Replace element with structured accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
