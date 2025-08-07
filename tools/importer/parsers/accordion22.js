/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly the example
  const rows = [['Accordion (accordion22)']];

  // 2. Get all direct .card children (each accordion item)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title cell: from .card-header -> h2, or just .card-header textContent
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      // Prefer first heading (keeps semantics)
      const h2 = header.querySelector('h2,h3,h4,h5,h6');
      if (h2) {
        titleCell = h2;
      } else {
        // fallback: header as plain text
        titleCell = document.createTextNode(header.textContent.trim());
      }
    }
    // Content cell: everything inside .card-body, preserving elements and structure
    let contentCell = '';
    const body = card.querySelector('.card-body');
    if (body) {
      // Use all child nodes (including text, elements, images, lists, etc)
      const nodes = Array.from(body.childNodes).filter(node => {
        // Remove empty text nodes
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      } else {
        contentCell = '';
      }
    }
    rows.push([titleCell, contentCell]);
  });
  // 3. Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // 4. Replace the original element with the new table
  element.replaceWith(table);
}
