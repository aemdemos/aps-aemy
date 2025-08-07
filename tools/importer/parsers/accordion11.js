/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header, as per the example
  const headerRow = ['Accordion (accordion11)'];

  // Find all direct card children (accordion items)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [];

  cards.forEach((card) => {
    // Title cell: look for the header (usually contains a heading)
    let titleCell = '';
    const header = card.querySelector(':scope > .card-header');
    if (header) {
      // Use direct child heading if present, otherwise the header itself
      const heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      titleCell = heading || header;
    }

    // Content cell: .collapse > .card-body, fallback to .collapse
    let contentCell = '';
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      contentCell = cardBody || collapse;
    }

    rows.push([titleCell, contentCell]);
  });

  // Compose table data
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
