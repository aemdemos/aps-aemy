/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match the block name from requirements
  const headerRow = ['Accordion (accordion2)'];

  // 2. Get the accordion title: .card-header > h2 (or all text if h2 missing)
  let title = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    const h2 = headerDiv.querySelector('h2');
    if (h2) {
      title = h2.textContent.trim();
    } else {
      title = headerDiv.textContent.trim();
    }
  }

  // 3. Get the accordion content: everything inside .collapse (prefer .card-body)
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    // If .card-body exists, use its contents, else use collapseDiv's
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      // Take all child nodes (not just elements) to preserve all text, structure, lists etc.
      const contentEls = Array.from(cardBody.childNodes).filter(n => (
        n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      ));
      // If only whitespace, fallback to empty string
      contentCell = contentEls.length > 0 ? contentEls : '';
    } else {
      // fallback: just all children of collapseDiv
      const contentEls = Array.from(collapseDiv.childNodes).filter(n => (
        n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      ));
      contentCell = contentEls.length > 0 ? contentEls : '';
    }
  }

  // 4. Compose the rows: header, then [title, content]
  const rows = [ headerRow, [title, contentCell] ];

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the new table
  element.replaceWith(table);
}
