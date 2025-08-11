/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child .card divs (each accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Table header exactly as required
  const headerRow = ['Accordion (accordion29)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // Get the title (always inside .card-header, as an h2)
    const headerDiv = card.querySelector('.card-header');
    let titleEl = null;
    if (headerDiv) {
      // Use the existing h2 element for semantic meaning
      const h2 = headerDiv.querySelector('h2');
      if (h2) {
        titleEl = h2; // Direct reference, do not clone
      } else {
        // Fallback to a span if no h2 present
        titleEl = document.createElement('span');
        titleEl.textContent = headerDiv.textContent.trim();
      }
    }

    // Get the body content (inside .collapse > .card-body)
    let contentEl = null;
    const collapseDiv = card.querySelector('.collapse');
    if (collapseDiv) {
      const cardBody = collapseDiv.querySelector('.card-body');
      if (cardBody) {
        contentEl = cardBody; // Reference the original element
      } else {
        // If .card-body missing but .collapse exists, use .collapse itself
        contentEl = collapseDiv;
      }
    }

    // Only add a row if both title and content are found
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  });

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
