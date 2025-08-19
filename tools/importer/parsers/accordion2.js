/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we dynamically extract all content, reference elements, and respect semantic meaning
  // Header row for accordion block
  const headerRow = ['Accordion (accordion2)'];

  // Get accordion title (should always use the heading, and reference the real heading element if possible)
  let titleCell;
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    // Try to find heading (h1-h6) inside headerDiv
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading; // Reference the actual heading element for semantic meaning
    } else {
      // Fallback: create a span with the headerDiv's text
      const span = document.createElement('span');
      span.textContent = headerDiv.textContent.trim();
      titleCell = span;
    }
  } else {
    // Fallback: use first child text
    const span = document.createElement('span');
    span.textContent = element.textContent.trim();
    titleCell = span;
  }

  // Get the content/body for this accordion item
  // Reference the content element (usually .card-body inside .collapse)
  let contentCell = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      // Use cardBody (contains full content, eg. lists, links)
      contentCell = cardBody;
    } else {
      // Fallback: use collapseDiv itself
      contentCell = collapseDiv;
    }
  } else {
    // Fallback: use element itself
    contentCell = element;
  }

  // Compose the rows: header, then [title, content]
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create the table block
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
