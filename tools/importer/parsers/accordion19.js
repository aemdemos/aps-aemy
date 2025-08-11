/* global WebImporter */
export default function parse(element, { document }) {
  // The header row, exactly as per spec
  const headerRow = ['Accordion (accordion19)'];

  // Each .card is an accordion item
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach(card => {
    // Title cell: always extract the visible title from .card-header h2 (or fallback to .card-header text)
    let titleCell = '';
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      if (h2) {
        titleCell = h2.textContent.trim();
      } else {
        titleCell = cardHeader.textContent.trim();
      }
    }

    // Content cell: preserve everything inside .card-body (reference direct children)
    let contentCell = [];
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      if (cardBody) {
        // If cardBody contains a single table, use that directly
        if (cardBody.children.length === 1 && cardBody.firstElementChild.tagName.toLowerCase() === 'table') {
          contentCell = [cardBody.firstElementChild];
        } else {
          // Otherwise, collect all direct children (including text nodes with text)
          contentCell = Array.from(cardBody.childNodes).filter(
            n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
          );
        }
      }
    }
    if (contentCell.length === 0) contentCell = ['']; // Edge case fallback

    rows.push([titleCell, contentCell]);
  });

  // Create table block and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
