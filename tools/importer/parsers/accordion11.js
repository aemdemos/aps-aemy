/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, matching the example exactly
  const headerRow = ['Accordion (accordion11)'];

  // Find all accordion items (cards) in this block
  // This selector will find all immediate .card children (multiple cards if present)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [];

  cards.forEach((card) => {
    // Title cell: heading inside card-header, or all card-header if no heading is found
    let titleCell = '';
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      const heading = cardHeader.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleCell = heading;
      } else {
        titleCell = cardHeader;
      }
    }
    // Content cell: body inside collapse
    let contentCell = '';
    const collapseDiv = card.querySelector(':scope > .collapse');
    if (collapseDiv) {
      const cardBody = collapseDiv.querySelector(':scope > .card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        contentCell = collapseDiv;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Compose table: header row, then all accordion items as rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
