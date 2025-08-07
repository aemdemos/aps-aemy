/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Accordion (accordion17)'];
  const rows = [headerRow];

  // Get all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title cell: extract the h2 from card-header
    let titleElem = card.querySelector('.card-header h2');
    let titleCell = titleElem ? titleElem : document.createTextNode('');

    // Content cell: extract all children from .card-body
    let contentCell;
    const body = card.querySelector('.card-body');
    if (body) {
      // If card-body only has whitespace text nodes, treat as empty
      const contentNodes = Array.from(body.childNodes).filter(
        node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim()
      );
      if (contentNodes.length === 0) {
        contentCell = document.createTextNode('');
      } else if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else {
        // If multiple nodes, put into a fragment
        const frag = document.createDocumentFragment();
        contentNodes.forEach(node => frag.appendChild(node));
        contentCell = frag;
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace with the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
