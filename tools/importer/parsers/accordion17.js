/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row per specification
  const headerRow = ['Accordion (accordion17)'];
  const rows = [];
  // Find all cards (direct children)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title: from card-header h2
    let titleCell = '';
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      if (h2) {
        titleCell = h2;
      } else {
        // fallback: entire cardHeader content
        titleCell = document.createTextNode(cardHeader.textContent.trim());
      }
    }
    // Content: all children of card-body inside .collapse
    let contentCell = '';
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      if (cardBody) {
        // Only include element and non-empty text nodes
        const contentNodes = Array.from(cardBody.childNodes).filter(
          (n) => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim())
        );
        if (contentNodes.length === 1) {
          contentCell = contentNodes[0];
        } else if (contentNodes.length > 1) {
          contentCell = contentNodes;
        } else {
          contentCell = '';
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Build the table and replace the element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);
  element.replaceWith(table);
}
