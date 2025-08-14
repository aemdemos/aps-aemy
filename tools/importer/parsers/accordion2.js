/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for block table
  const headerRow = ['Accordion (accordion2)'];

  // 2. Extract accordion title from .card-header
  let titleCell;
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Use the existing heading (h2, h3 etc) if present, else use the cardHeader itself
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // fallback, use cardHeader directly
      titleCell = cardHeader;
    }
  } else {
    // fallback: blank cell
    titleCell = document.createElement('span');
    titleCell.textContent = '';
  }

  // 3. Extract accordion content from .card-body inside the .collapse content
  let contentCell;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    } else {
      // fallback, use the collapseDiv
      contentCell = collapseDiv;
    }
  } else {
    // fallback: use whole element
    contentCell = element;
  }

  // 4. Build rows: header, [title, content]
  const rows = [
    headerRow,
    [titleCell, contentCell],
  ];

  // 5. Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace element
  element.replaceWith(table);
}
