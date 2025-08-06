/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block table, exactly as specified
  const headerRow = ['Accordion (accordion14)'];

  // Find all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach(card => {
    // Title cell: get the header text/element
    const cardHeader = card.querySelector('.card-header');
    let titleCell;
    if (cardHeader) {
      // Use the lowest-level heading if present, else the full header
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      titleCell = heading ? heading : cardHeader;
    } else {
      // Defensive: if no header, insert empty
      titleCell = document.createTextNode('');
    }

    // Content cell: get the .card-body, if present
    const cardBody = card.querySelector('.card-body');
    let contentCell;
    if (cardBody) {
      // For all iframes in the content, replace with links as required
      const iframes = cardBody.querySelectorAll('iframe[src]');
      iframes.forEach(iframe => {
        const src = iframe.getAttribute('src');
        // Only create a link if 'src' exists (defensive)
        if (src) {
          const link = document.createElement('a');
          link.href = src;
          link.textContent = src;
          iframe.replaceWith(link);
        }
      });
      contentCell = cardBody;
    } else {
      // Defensive: if no body, insert empty
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the accordion table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
