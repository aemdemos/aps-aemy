/* global WebImporter */
export default function parse(element, { document }) {
  // Create the accordion block header row, exactly as specified
  const headerRow = ['Accordion (accordion3)'];

  // Find all .card children directly under the element
  let cards = Array.from(element.querySelectorAll(':scope > .card'));
  // If this element itself is a .card and not an accordion container
  if (cards.length === 0 && element.classList.contains('card')) {
    cards = [element];
  }

  const rows = [headerRow];

  cards.forEach(card => {
    // Title cell
    let titleCell;
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      const heading = cardHeader.querySelector('h1,h2,h3,h4,h5,h6');
      // Reference the heading element directly if it exists
      if (heading) {
        titleCell = heading;
      } else {
        // If no heading, reference the cardHeader element
        titleCell = cardHeader;
      }
    } else {
      // Fallback: reference the card itself
      titleCell = card;
    }
    
    // Content cell
    let contentCell;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      // Reference the cardBody element directly if it exists, otherwise collapse
      contentCell = cardBody ? cardBody : collapse;
    } else {
      // Fallback: reference the card itself
      contentCell = card;
    }
    // Replace iframes in contentCell (not images) with links to their src
    if (contentCell && contentCell.querySelectorAll) {
      contentCell.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src) {
          const link = document.createElement('a');
          link.href = iframe.src;
          link.textContent = iframe.src;
          iframe.parentNode.replaceChild(link, iframe);
        }
      });
    }

    // Add the row: always 2 columns, referencing existing elements
    rows.push([titleCell, contentCell]);
  });

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
