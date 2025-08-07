/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion: two columns, each row is [title, content]
  // Header row is: ['Accordion (accordion35)']
  const headerRow = ['Accordion (accordion35)'];

  // Get all direct child cards (accordion items)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  const rows = cards.map(card => {
    // Title cell: .card-header > first heading or fallback to .card-header
    const cardHeader = card.querySelector(':scope > .card-header');
    let title = null;
    if (cardHeader) {
      title = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (!title) {
        // Fallback to any text element
        title = cardHeader.querySelector('p, div, span');
      }
      if (!title) {
        // Fallback to header itself
        title = cardHeader;
      }
    }

    // Content cell: .collapse > .card-body (grabs ALL content, keeps formatting)
    let content = null;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      content = collapse.querySelector(':scope > .card-body') || collapse;
    }

    return [title, content];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
