/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name exactly
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Get direct child accordion items
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach((card) => {
    // Title: Find heading inside .card-header
    const cardHeader = card.querySelector('.card-header');
    let titleText = '';
    if (cardHeader) {
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        // Reference the heading element directly to preserve formatting
        titleText = heading;
      } else {
        // Fallback: create a span for the header text if no heading found
        const span = document.createElement('span');
        span.textContent = cardHeader.textContent.trim();
        titleText = span;
      }
    } else {
      // Fallback if .card-header missing
      const span = document.createElement('span');
      span.textContent = '';
      titleText = span;
    }

    // Content: Find .card-body inside .collapse
    let contentCell;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        // Reference the card-body element directly
        contentCell = body;
      } else {
        // If no .card-body, include all contents of .collapse
        contentCell = collapse;
      }
    } else {
      // Fallback if no .collapse
      contentCell = document.createElement('div');
    }

    // Each row is [title, content] as per block specification
    rows.push([titleText, contentCell]);
  });

  // Create the table block and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
