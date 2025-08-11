/* global WebImporter */
export default function parse(element, { document }) {
  // Block header matches example markdown
  const headerRow = ['Accordion (accordion35)'];

  // Get all immediate .card children in the accordion block
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Each row is [title, content]
  const rows = cards.map(card => {
    // Title cell - use h2 if present, else use card-header's text
    const cardHeader = card.querySelector('.card-header');
    let titleElem = null;
    if (cardHeader) {
      titleElem = cardHeader.querySelector('h2');
      if (!titleElem) {
        // fallback: use cardHeader text, preserve formatting
        titleElem = document.createElement('div');
        titleElem.innerHTML = cardHeader.innerHTML.trim();
      }
    } else {
      titleElem = document.createElement('div');
      titleElem.textContent = '';
    }
    // Content cell - use card-body if available
    const cardBody = card.querySelector('.card-body');
    let contentElem;
    if (cardBody) {
      // If only one child, use that child directly
      if (cardBody.children.length === 1) {
        contentElem = cardBody.children[0];
      } else {
        contentElem = cardBody;
      }
    } else {
      contentElem = document.createElement('div');
      contentElem.textContent = '';
    }
    return [titleElem, contentElem];
  });

  // Compose the full table structure
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
