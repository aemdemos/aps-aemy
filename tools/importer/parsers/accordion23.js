/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as in example
  const headerRow = ['Accordion (accordion23)'];
  const cells = [headerRow];

  // Find all .card children (accordion items)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: Use h2 inside .card-header (preferred for semantic consistency)
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      titleCell = h2 ? h2 : header;
    }
    // Content cell: All children of .card-body inside .collapse
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // Gather all meaningful children (elements and non-empty text)
        const children = Array.from(cardBody.childNodes).filter(n => {
          return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim());
        });
        if (children.length > 1) {
          contentCell = children;
        } else if (children.length === 1) {
          contentCell = children[0];
        } else {
          contentCell = cardBody;
        }
      } else {
        contentCell = collapse;
      }
    }
    cells.push([titleCell, contentCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
