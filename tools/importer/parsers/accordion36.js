/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion36) block header
  const headerRow = ['Accordion (accordion36)'];

  // Get the accordion title (from card-header > h2 or card-header's text)
  let titleCell = null;
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    // Prefer a heading element if present
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    titleCell = heading || headerDiv;
  }

  // Get the content cell: everything inside collapse > card-body
  let contentCell = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      // If the card-body only contains the table, reference the table directly
      if (
        cardBody.children.length === 1 &&
        cardBody.firstElementChild && cardBody.firstElementChild.tagName === 'TABLE'
      ) {
        contentCell = cardBody.firstElementChild;
      } else {
        // Otherwise, include all children (could be multiple nodes)
        contentCell = Array.from(cardBody.childNodes).filter(
          node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
        );
      }
    } else {
      // Fallback: if there is no card-body, include all collapseDiv children
      contentCell = Array.from(collapseDiv.childNodes).filter(
        node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
      );
    }
  }

  // Build rows for Accordion table
  const rows = [
    headerRow,
    [titleCell, contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
