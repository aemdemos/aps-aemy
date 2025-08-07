/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion6) header
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  // Select all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach((card) => {
    // Title cell: prefer <h2>, fallback to .card-header text
    let titleElem = card.querySelector('.card-header h2, .card-header .h6, .card-header .h5, .card-header .h4, .card-header .h3, .card-header .h2, .card-header .h1');
    if (!titleElem) {
      titleElem = card.querySelector('.card-header');
    }
    // Don't clone! Reference the existing element (or its text node)
    let titleCell;
    if (titleElem) {
      titleCell = titleElem;
    } else {
      titleCell = '';
    }

    // Content cell: all direct children of .card-body (reference directly)
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // If cardBody has only one child that's a div, unwrap to its children
        const topDivs = Array.from(cardBody.children);
        if (topDivs.length === 1 && topDivs[0].tagName.toLowerCase() === 'div') {
          // Use the child div's children
          const innerDiv = topDivs[0];
          if (innerDiv.children.length) {
            contentCell = Array.from(innerDiv.children);
          } else {
            contentCell = innerDiv; // fallback if no children
          }
        } else {
          contentCell = topDivs.length > 0 ? topDivs : cardBody;
        }
      } else {
        // fallback: reference collapse content
        contentCell = collapse;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
