/* global WebImporter */
export default function parse(element, { document }) {
  // Table rows initialization with correct header
  const rows = [
    ['Accordion (accordion22)']
  ];
  // Get all direct accordion cards
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  cards.forEach(card => {
    // Title cell: Try to reference the actual heading in the header
    let titleCell = null;
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Use the heading element if available, else fallback to header wrapper span
      const heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // fallback for missing heading markup
        const span = document.createElement('span');
        span.textContent = header.textContent.trim();
        titleCell = span;
      }
    }
    // Content cell: reference the .card-body directly (may contain several children)
    let contentCell = null;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const body = collapse.querySelector(':scope > .card-body');
      if (body) {
        contentCell = body;
      } else if (collapse.children.length > 0) {
        // fallback: use collapse wrapper if card-body missing
        contentCell = collapse;
      }
    } else {
      // fallback: just get card-body if no collapse present
      const body = card.querySelector(':scope > .card-body');
      if (body) {
        contentCell = body;
      }
    }
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
