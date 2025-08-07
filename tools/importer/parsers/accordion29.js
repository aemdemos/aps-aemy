/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children with a given class
  function getDirectChildrenWithClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Build header row as required
  const rows = [['Accordion (accordion29)']];

  // Select all direct .card children (each accordion item)
  const cards = getDirectChildrenWithClass(element, 'card');

  cards.forEach(card => {
    // Title: .card-header > h2 (or .card-header contents if no h2)
    let titleContent = '';
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      if (h2) {
        titleContent = h2;
      } else {
        // Fallback: Use entire card-header (references existing node)
        titleContent = cardHeader;
      }
    }

    // Content: .collapse > .card-body (or .collapse contents if no .card-body)
    let contentContent = '';
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      if (cardBody) {
        contentContent = cardBody;
      } else {
        // Fallback: all children inside .collapse (excluding possible script/style)
        const contentNodes = Array.from(collapse.childNodes).filter(
          n => n.nodeType !== 3 || n.textContent.trim() !== '' // skip empty text
        );
        contentContent = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
      }
    }

    rows.push([titleContent, contentContent]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
