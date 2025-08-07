/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header
  const headerRow = ['Accordion (accordion17)'];
  const rows = [headerRow];

  // Get all direct .card children (each card is an accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  cards.forEach(card => {
    // Title cell: the heading in .card-header (prefer h2, fallback to textContent)
    let titleCell = '';
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      titleCell = h2 ? h2 : cardHeader;
    }
    // Content cell: all content of .card-body, referenced as a fragment
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // If only one child, use directly, else use array of nodes
        const childNodes = Array.from(cardBody.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
        if (childNodes.length === 1) {
          contentCell = childNodes[0];
        } else if (childNodes.length > 1) {
          contentCell = childNodes;
        } else {
          contentCell = '';
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
