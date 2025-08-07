/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the block name exactly
  const headerRow = ['Accordion (accordion4)'];
  const rows = [headerRow];
  // Each card is an accordion item
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: get the heading (h1-h6) inside the card-header if available, else use card-header text
    let titleCell = '';
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      // Search for any heading element
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // If no heading, create a span for the text
        const span = document.createElement('span');
        span.textContent = cardHeader.textContent.trim();
        titleCell = span;
      }
    }
    // Content cell: use the .card-body element if present
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // If cardBody exists, use it directly
        contentCell = cardBody;
      } else {
        // Fallback: use all children of collapse
        const collapseChildren = Array.from(collapse.children);
        if (collapseChildren.length === 1) {
          contentCell = collapseChildren[0];
        } else if (collapseChildren.length > 1) {
          contentCell = collapseChildren;
        } else {
          contentCell = '';
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });
  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
