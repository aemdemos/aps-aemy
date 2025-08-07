/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Accordion block
  const headerRow = ['Accordion (accordion3)'];

  // Get all direct child .card elements (accordion items)
  const cards = element.querySelectorAll(':scope > .card');

  // For each card, extract the title and content referencing existing nodes directly
  const rows = Array.from(cards).map(card => {
    // Title cell: get the .card-header, and if it has only one child, use that child
    let titleHeader = card.querySelector('.card-header');
    let titleCell = titleHeader;
    if (titleHeader && titleHeader.children.length === 1) {
      titleCell = titleHeader.children[0];
    }

    // Content cell: get the .collapse .card-body content, fallback to .collapse if needed
    let contentCell = card.querySelector('.collapse .card-body');
    if (!contentCell) {
      contentCell = card.querySelector('.collapse');
    }
    return [titleCell, contentCell];
  });

  // Build the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
