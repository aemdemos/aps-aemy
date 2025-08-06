/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows following the 2-column accordion block structure
  const rows = [];
  // 1. Header row
  rows.push(['Accordion (accordion2)']);

  // 2. Accordion item rows
  // Each card represents a single accordion item.
  // Title cell: The label in the card-header
  // Content cell: The element that will be revealed/hidden when expanded (all content inside card-body)

  // Title: find inside card-header, prefer heading, else fallback to textContent
  const cardHeader = element.querySelector('.card-header');
  let titleCell;
  if (cardHeader) {
    // Try to use the heading (h1-h6) if present, otherwise use the card-header itself
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      titleCell = cardHeader;
    }
  } else {
    titleCell = '';
  }

  // Content: card-body contains all the visible content when expanded
  let contentCell;
  const collapse = element.querySelector('.collapse');
  if (collapse) {
    // Try to find .card-body inside collapse
    const cardBody = collapse.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    } else {
      // fallback: use all children of collapse
      // Create a fragment to hold all children
      const frag = document.createDocumentFragment();
      Array.from(collapse.childNodes).forEach(child => frag.appendChild(child));
      contentCell = frag;
    }
  } else {
    contentCell = '';
  }

  rows.push([titleCell, contentCell]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
