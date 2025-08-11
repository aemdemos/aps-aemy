/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Accordion (accordion6)'];
  const cells = [headerRow];

  // Get all accordion items (direct children with class 'card')
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  cards.forEach(card => {
    // Title cell: Use existing h2 inside .card-header if present; else use the .card-header's text as fallback
    let titleEl = card.querySelector('.card-header h2');
    if (!titleEl) {
      const header = card.querySelector('.card-header');
      titleEl = document.createElement('div');
      titleEl.textContent = header ? header.textContent.trim() : '';
    }

    // Content cell: Use existing .card-body content as-is, referencing real elements (not clones)
    const body = card.querySelector('.card-body');
    let contentCell;
    if (body) {
      // Gather all top-level children of .card-body
      const children = Array.from(body.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        // Wrap multiple children in a fragment for a single cell
        const frag = document.createDocumentFragment();
        children.forEach(child => frag.appendChild(child));
        contentCell = frag;
      } else {
        // No children, use body itself
        contentCell = body;
      }
    } else {
      contentCell = document.createElement('div'); // Empty fallback
    }

    cells.push([titleEl, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
