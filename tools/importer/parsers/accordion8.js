/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one column, must match example exactly
  const headerRow = ['Accordion (accordion8)'];
  const rows = [headerRow];

  // Get all direct child cards (accordion items)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach((card) => {
    // Title: the .card-header > h2 (or fallback to .card-header)
    let titleEl = card.querySelector(':scope > .card-header h2');
    if (!titleEl) {
      titleEl = card.querySelector(':scope > .card-header') || document.createElement('span');
    }

    // Content: .card-body (reference, do not clone)
    const cardBody = card.querySelector(':scope > .collapse > .card-body');
    let contentCell;
    if (cardBody) {
      // Replace all iframes (not images) with links in place
      cardBody.querySelectorAll('iframe').forEach((iframe) => {
        const src = iframe.getAttribute('src');
        if (src) {
          const a = document.createElement('a');
          a.href = src;
          a.textContent = src;
          iframe.replaceWith(a);
        }
      });
      contentCell = cardBody;
    } else {
      contentCell = document.createElement('span'); // empty cell fallback
    }

    // Each row must be a two-column array to match table structure, even if header row is one column
    rows.push([titleEl, contentCell]);
  });

  // To ensure the header row visually spans two columns, set colSpan after table creation
  const block = WebImporter.DOMUtils.createTable(rows, document);
  const firstRow = block.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }
  element.replaceWith(block);
}
