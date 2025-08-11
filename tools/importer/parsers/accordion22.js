/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Accordion (accordion22)'];

  // Gather all cards (accordion items)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  const rows = cards.map(card => {
    // Get the title cell: the heading inside .card-header
    let titleContainer = card.querySelector('.card-header');
    let heading = titleContainer && titleContainer.querySelector('h1,h2,h3,h4,h5,h6');
    // Fallback: use the textContent of the card-header
    let titleContent = heading ? heading : titleContainer;
    // Reference existing element (not clone)
    // Remove any extraneous attributes/styles for clean import
    let titleDiv = document.createElement('div');
    titleDiv.textContent = titleContent ? titleContent.textContent.trim() : '';

    // Get the content cell: .card-body inside .collapse
    let bodyContainer = card.querySelector('.collapse > .card-body');
    let contentCell;
    if (bodyContainer) {
      // If there is only one child, reference it
      // Else, put all children into an array for the cell
      const children = Array.from(bodyContainer.childNodes).filter(
        node => node.nodeType !== 3 || node.textContent.trim() !== '' // no empty text nodes
      );
      contentCell = children.length === 1 ? children[0] : children;
    } else {
      contentCell = '';
    }
    return [titleDiv, contentCell];
  });

  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
