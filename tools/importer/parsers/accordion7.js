/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all immediate .card children (each accordion panel)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Header row exactly as specified
  const rows = [['Accordion (accordion7)']];

  cards.forEach(card => {
    // Title cell: find the heading element inside .card-header
    const header = card.querySelector('.card-header');
    let titleEl = null;
    if (header) {
      // Try to find the first heading (h2-h6)
      titleEl = header.querySelector('h2,h3,h4,h5,h6');
      if (!titleEl) {
        // If not found, create a span and use the textContent of header
        titleEl = document.createElement('span');
        titleEl.textContent = header.textContent.trim();
      }
    } else {
      // If no header, fallback to empty span
      titleEl = document.createElement('span');
    }

    // Content cell: use the .card-body as-is if available
    let contentEl = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentEl = cardBody;
      } else {
        // fallback to empty span if no .card-body
        contentEl = document.createElement('span');
      }
    } else {
      // fallback to empty span if no .collapse
      contentEl = document.createElement('span');
    }

    rows.push([titleEl, contentEl]);
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
