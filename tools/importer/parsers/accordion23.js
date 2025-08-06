/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Each accordion item is a .card
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title cell extraction: Prefer h1-h6 inside .card-header
    let titleCell;
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      let heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // Use the entire header if no heading element
        titleCell = cardHeader;
      }
    } else {
      // fallback: blank cell
      titleCell = document.createElement('div');
    }

    // Content cell extraction: all content of .card-body (if present)
    let contentCell;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        // fallback: use collapse content
        contentCell = collapse;
      }
    } else {
      // fallback: blank cell
      contentCell = document.createElement('div');
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
