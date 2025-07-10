/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside this element
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all immediate card children
  const cards = accordion.querySelectorAll(':scope > .card');
  const rows = [['Accordion']]; // Header row as in the example

  cards.forEach(card => {
    // Title cell: grab heading from .card-header > h2 if present, else fallback to .card-header text
    let title = '';
    const headerDiv = card.querySelector('.card-header');
    if (headerDiv) {
      const h2 = headerDiv.querySelector('h2');
      if (h2) {
        title = h2.textContent.trim();
      } else {
        title = headerDiv.textContent.trim();
      }
    }

    // Content cell: reference the .card-body block if it exists, else empty string
    let content = '';
    const bodyDiv = card.querySelector('.card-body');
    if (bodyDiv) {
      content = bodyDiv;
    }

    rows.push([title, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
