/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per requirement
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all cards (accordion items)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach(card => {
    // Title cell: use the heading inside .card-header
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      // Find first heading or <h2> (which is required for semantic meaning)
      const h2 = header.querySelector('h2, .h6');
      if (h2) {
        titleCell = h2;
      } else {
        // If heading missing, use the .card-header's text content
        const div = document.createElement('div');
        div.textContent = header.textContent.trim();
        titleCell = div;
      }
    }

    // Content cell: body of accordion
    let contentCell = '';
    const body = card.querySelector('.card-body');
    if (body) {
      // If the body has only one main container, use it, else wrap in a div
      // Use all ELEMENT children (preserve structure)
      const nodes = Array.from(body.childNodes).filter(n => {
        // only non-empty text nodes or element nodes
        return (
          (n.nodeType === Node.ELEMENT_NODE) ||
          (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        )
      });
      if (nodes.length === 1 && nodes[0].nodeType === Node.ELEMENT_NODE) {
        contentCell = nodes[0];
      } else {
        // Wrap in a div to keep all content in a single cell
        const wrapper = document.createElement('div');
        nodes.forEach(n => wrapper.appendChild(n));
        contentCell = wrapper;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
