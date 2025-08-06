/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header row
  const headerRow = ['Accordion (accordion36)'];

  // 2. Extract accordion title from card-header -> h2, fallback to card-header text
  let titleCell;
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else if (cardHeader.childNodes.length > 0) {
      // If no heading but text exists, use the cardHeader itself
      titleCell = cardHeader;
    } else {
      titleCell = document.createTextNode('');
    }
  } else {
    titleCell = document.createTextNode('');
  }

  // 3. Extract accordion content (card-body inside .collapse)
  let contentCell;
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    // Use everything inside collapse (typically card-body)
    // Prefer only the immediate card-body if it exists
    const cardBody = collapse.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    } else {
      // fallback: all children of collapse
      const nodes = Array.from(collapse.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else {
        contentCell = nodes;
      }
    }
  } else {
    contentCell = document.createTextNode('');
  }

  // 4. Build the final table structure
  const rows = [
    headerRow,
    [titleCell, contentCell],
  ];

  // 5. Create the block and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
