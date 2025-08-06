/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Accordion block
  const headerRow = ['Accordion (accordion12)'];

  // Accordion block should have 2 columns: title, content
  // Find the title cell: get the heading from the card-header
  let titleCell;
  const headerDiv = element.querySelector(':scope > .card-header');
  if (headerDiv) {
    // Use the first heading if present, else all headerDiv content
    const heading = headerDiv.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      titleCell = heading;
    } else {
      titleCell = headerDiv;
    }
  } else {
    // fallback: blank
    titleCell = document.createElement('div');
  }

  // Content cell: get .card-body (inside the .collapse)
  let contentCell;
  const collapse = element.querySelector(':scope > .collapse');
  if (collapse) {
    const bodyDiv = collapse.querySelector('.card-body');
    if (bodyDiv) {
      contentCell = bodyDiv;
    } else {
      // fallback: any content in collapse
      contentCell = collapse;
    }
  } else {
    // fallback: blank
    contentCell = document.createElement('div');
  }

  // Build the table array
  const rows = [
    headerRow,
    [titleCell, contentCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
