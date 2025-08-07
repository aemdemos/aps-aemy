/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the accordion block
  const headerRow = ['Accordion (accordion27)'];
  const rows = [headerRow];

  // Find all immediate card children (each accordion item)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title (mandatory): .card-header > h2, or fallback .card-header text
    let titleCell = null;
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        titleCell = h2;
      } else {
        // fallback: use header's text content
        titleCell = document.createElement('span');
        titleCell.textContent = header.textContent.trim();
      }
    } else {
      // fallback in case .card-header is missing
      titleCell = document.createElement('span');
      titleCell.textContent = '';
    }

    // Content (mandatory): all inside .collapse > .card-body (reference node itself, not clone)
    let contentCell = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        contentCell = body;
      } else {
        // fallback: use collapse content (in case .card-body is missing)
        contentCell = collapse;
      }
    } else {
      // fallback: empty content
      contentCell = document.createElement('div');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
