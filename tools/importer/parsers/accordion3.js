/* global WebImporter */
export default function parse(element, { document }) {
  // ACCORDION BLOCK: Accordion (accordion3)
  // Header row as per requirements
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Find all immediate .card children, each is an accordion entry
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: .card-header inner element(s), keep structure and formatting
    let titleCell;
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      // Use the first element child (h2 usually), but if not, use full card-header
      if (cardHeader.children.length === 1) {
        titleCell = cardHeader.firstElementChild;
      } else {
        titleCell = cardHeader;
      }
    } else {
      // fallback: card's first child if nothing else
      titleCell = card.firstElementChild;
    }

    // Content cell: .card-body (direct child of .collapse)
    let contentCell = undefined;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      // Prefer a .card-body child if present
      const cardBody = collapse.querySelector(':scope > .card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        // fallback: collapse itself (should not happen with valid markup)
        contentCell = collapse;
      }
    } else {
      // fallback: card itself (should not happen with valid markup)
      contentCell = card;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
