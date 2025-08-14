/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards18)'];
  // Get all direct card elements
  const cards = Array.from(element.children);
  const rows = cards.map(card => {
    // Icon (should always exist)
    const icon = card.querySelector('i');
    // Number (should always exist)
    const number = card.querySelector('span.cartfig');
    // Title (should always exist)
    const title = card.querySelector('p');

    // First cell: icon element
    // Second cell: number (heading) + title (description)
    const cellContent = [];
    if (number) {
      // Use <strong> for heading-like text
      const heading = document.createElement('strong');
      heading.textContent = number.textContent;
      cellContent.push(heading);
      cellContent.push(document.createElement('br'));
    }
    if (title) {
      // Use span for description
      const desc = document.createElement('span');
      desc.textContent = title.textContent;
      cellContent.push(desc);
    }
    // If number or title missing, skip their cellContent
    return [icon, cellContent];
  });
  // All rows: header + card rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
