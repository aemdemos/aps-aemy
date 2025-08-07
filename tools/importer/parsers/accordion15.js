/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: as specified
  const headerRow = ['Accordion (accordion15)'];

  // 1. Extract the accordion title (required)
  // The title is inside .card-header, typically in a heading
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Prefer heading element for semantic value
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // fallback: use the full .card-header element (to preserve any markup)
      titleCell = cardHeader;
    }
  }

  // 2. Extract the content cell (body of the accordion item)
  // Content is in .collapse > .card-body
  let contentCell = '';
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    const cardBody = collapse.querySelector('.card-body');
    if (cardBody) {
      // If cardBody only has a single table, use the table, else use the body.
      if (cardBody.children.length === 1 && cardBody.children[0].tagName === 'TABLE') {
        contentCell = cardBody.children[0];
      } else {
        contentCell = cardBody;
      }
    } else {
      // fallback: put the entire .collapse element (should be adequate if structure varies)
      contentCell = collapse;
    }
  }

  // 3. Compose the rows as per required structure (header, then 1 row for this item)
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // 4. Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
