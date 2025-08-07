/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must exactly match the block name from the example
  const headerRow = ['Accordion (accordion35)'];
  // Find all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach(card => {
    // Title cell: get heading text from .card-header
    let cardHeader = card.querySelector(':scope > .card-header');
    let titleEl = null;
    if (cardHeader) {
      // Prefer any heading tag inside the header
      let heading = cardHeader.querySelector('h1,h2,h3,h4,h5,h6,.h6');
      if (heading) {
        titleEl = heading;
      } else {
        // Otherwise, create a span with the header text for resilience
        titleEl = document.createElement('span');
        titleEl.textContent = cardHeader.textContent.trim();
      }
    } else {
      // Fallback in case header is missing
      titleEl = document.createElement('span');
      titleEl.textContent = '';
    }

    // Content cell: gather all content from .card-body
    let cardBody = card.querySelector(':scope > .collapse > .card-body');
    let contentCell;
    if (cardBody) {
      // Use all children (preserve blocks of content, lists, buttons, etc.)
      const contentNodes = Array.from(cardBody.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    } else {
      // In case .card-body is missing, insert empty cell
      contentCell = document.createTextNode('');
    }

    rows.push([titleEl, contentCell]);
  });

  // Create the accordion block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
