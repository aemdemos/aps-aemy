/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches exactly the block name
  const cells = [
    ['Accordion (accordion6)']
  ];
  // Get all accordion item cards
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title in first column: h2 inside the .card-header
    let titleElem = card.querySelector(':scope > .card-header h2');
    // Content in second column: get all nodes inside .card-body
    let contentCellNodes = [];
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      // Usually, the .card-body has a single child div or sequence of divs/ps
      let addNodes = [];
      // If cardBody has only one child and it's a DIV, flatten its children
      if (
        cardBody.children.length === 1 &&
        cardBody.firstElementChild.tagName === 'DIV'
      ) {
        addNodes = Array.from(cardBody.firstElementChild.childNodes);
      } else {
        // Otherwise, use its direct children
        addNodes = Array.from(cardBody.childNodes);
      }
      // Filter empty text nodes
      addNodes.forEach(node => {
        if (
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
        ) {
          contentCellNodes.push(node);
        }
      });
    }
    cells.push([
      titleElem,
      contentCellNodes
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
