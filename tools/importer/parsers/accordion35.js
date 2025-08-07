/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row exactly as required
  const headerRow = ['Accordion (accordion35)'];

  // Get all immediate .card children = each accordion item
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  // Each card: extract title and content as elements, referencing existing nodes
  const rows = cards.map(card => {
    // Title: header inside .card-header, prefer heading tags if present, fall back if not
    const cardHeader = card.querySelector('.card-header');
    let titleElem;
    if (cardHeader) {
      // Use first heading (h1-h6) if available, else the cardHeader itself
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      titleElem = heading || cardHeader;
    } else {
      // Defensive: create empty span
      titleElem = document.createElement('span');
      titleElem.textContent = '';
    }
    // Content: body is .card-body (contains all details)
    const body = card.querySelector('.card-body');
    let contentElem;
    if (body) {
      contentElem = body;
    } else {
      contentElem = document.createElement('span');
      contentElem.textContent = '';
    }
    return [titleElem, contentElem];
  });

  // Compose table: header row + each accordion row
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(table);
}
