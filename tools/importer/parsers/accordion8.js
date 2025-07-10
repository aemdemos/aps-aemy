/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .accordion block inside the element
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all direct .card children of the accordion
  const cards = accordion.querySelectorAll(':scope > .card');

  // Prepare the rows for the block table
  const rows = [['Accordion']]; // Header row exactly as required

  cards.forEach(card => {
    // Title cell extraction
    let titleEl = null;
    const header = card.querySelector('.card-header');
    if (header) {
      // Use the h2 if present, else use the .card-header itself
      const h2 = header.querySelector('h2');
      titleEl = h2 ? h2 : header;
    }

    // Content cell extraction
    let contentEl = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      // Only extract the .card-body, not all .collapse (avoids nested headers, etc.)
      const body = collapse.querySelector('.card-body');
      if (body) {
        contentEl = body;
      } else {
        // fallback if .card-body is missing (shouldn't happen here)
        contentEl = collapse;
      }
    }

    // Only add the row if both title and content are found
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  });

  // Create the block table using the required helper
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the .accordion element directly with the new table
  accordion.replaceWith(block);
}
