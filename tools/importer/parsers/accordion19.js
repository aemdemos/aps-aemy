/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Accordion (accordion19)'];
  const rows = [headerRow];

  // Get all accordion cards
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // --- TITLE CELL ---
    // Find the title - h2 inside .card-header
    let title = '';
    const header = card.querySelector(':scope > .card-header h2');
    if (header) {
      // Reference the heading element directly (preserves heading semantics)
      title = header;
    } else {
      // fallback: use .card-header textContent
      const headerDiv = card.querySelector(':scope > .card-header');
      title = headerDiv ? headerDiv.textContent.trim() : '';
    }

    // --- CONTENT CELL ---
    // Reference the .card-body's children directly
    let contentCell = '';
    const body = card.querySelector(':scope > .collapse > .card-body');
    if (body) {
      // If more than one child, reference as array; if only one, just that element
      if (body.children.length === 1) {
        contentCell = body.children[0];
      } else if (body.children.length > 1) {
        contentCell = Array.from(body.children);
      } else if (body.childNodes.length === 1 && body.childNodes[0].nodeType === 3) {
        // single text node
        contentCell = body.textContent.trim();
      } else {
        // fallback: reference the body element itself (in case of unstructured content)
        contentCell = body;
      }
    }
    rows.push([title, contentCell]);
  });

  // Build and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
