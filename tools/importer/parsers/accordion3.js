/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Accordion (accordion3)'];

  // Get all top-level .card child elements (one per accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  const rows = [];

  cards.forEach((card) => {
    // Title cell: get the text or element from .card-header
    let titleCell = null;
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Prefer the heading element, but fallback to the header itself
      const heading = header.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleCell = heading;
      } else if (header.firstElementChild) {
        titleCell = header.firstElementChild;
      } else {
        // fallback: wrap the header's textContent in a span
        const span = document.createElement('span');
        span.textContent = header.textContent.trim();
        titleCell = span;
      }
    }

    // Content cell: get the .card-body element (includes all text, lists, formatting, etc)
    let contentCell = null;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const body = collapse.querySelector(':scope > .card-body');
      if (body) {
        contentCell = body;
      } else {
        // fallback: just use the collapse content
        contentCell = collapse;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Compose the cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
