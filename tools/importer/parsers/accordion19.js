/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row with the exact block name
  const headerRow = ['Accordion (accordion19)'];

  // Get all immediate child .card elements (each accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Create table rows for each accordion item
  const rows = cards.map(card => {
    // Get the clickable title
    let titleEl;
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Try headline element first
      const h = header.querySelector('h1, h2, h3, h4, h5, h6');
      titleEl = h ? h : header;
    } else {
      titleEl = document.createElement('span');
      titleEl.textContent = '';
    }

    // Get the content for the accordion item
    let contentEl;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      // Use the card-body if available
      const body = collapse.querySelector(':scope > .card-body');
      contentEl = body ? body : collapse;
    } else {
      contentEl = document.createElement('div');
      contentEl.textContent = '';
    }

    // Return the table row (2 columns)
    return [titleEl, contentEl];
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
