/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per requirements
  const headerRow = ['Accordion (accordion19)'];

  // Find all accordion items (cards)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  const rows = cards.map((card) => {
    // Title cell: use the content from card-header (prefer heading, fall back to text)
    let titleEl;
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      // Use the first heading (h1-h6) if present, else the full .card-header
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleEl = heading;
      } else {
        titleEl = cardHeader;
      }
    } else {
      // Fallback: use a span with trimmed text content
      titleEl = document.createElement('span');
      titleEl.textContent = card.textContent.trim();
    }

    // Content cell: use the contents of .card-body (not just innerHTML, but actual child nodes/elements)
    let contentCell;
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      // If the .card-body contains only one table, use the table as one cell content
      if (
        cardBody.childNodes.length === 1 &&
        cardBody.firstElementChild &&
        cardBody.firstElementChild.tagName === 'TABLE'
      ) {
        contentCell = cardBody.firstElementChild;
      } else {
        // Otherwise include all (including text, paragraphs, links, etc). Use all childNodes to preserve text nodes.
        contentCell = Array.from(cardBody.childNodes);
      }
    } else {
      contentCell = '';
    }

    return [titleEl, contentCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
