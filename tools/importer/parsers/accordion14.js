/* global WebImporter */
export default function parse(element, { document }) {
  // Table Header: block name exactly as required
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Each .card is an accordion item with a title and content
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title: usually inside .card-header h2 (reference actual node)
    let titleCell = null;
    const cardHeader = card.querySelector('.card-header');
    const headerH2 = cardHeader ? cardHeader.querySelector('h2') : null;
    if (headerH2) {
      titleCell = headerH2;
    } else if (cardHeader) {
      // Fallback: Use .card-header text if no h2
      titleCell = document.createElement('span');
      titleCell.textContent = cardHeader.textContent.trim();
    } else {
      // If absolutely no header, use empty cell
      titleCell = document.createElement('span');
    }

    // Content: put .card-body directly, but fix iframes to links
    let contentCell = null;
    const body = card.querySelector('.card-body');
    if (body) {
      // Replace all iframe[src] (non-img) with an <a href=...> per requirements
      // Reference the actual 'body' node in the cell
      // Replace each iframe with a link before putting the body in the table
      body.querySelectorAll('iframe[src]').forEach(iframe => {
        const src = iframe.getAttribute('src');
        const a = document.createElement('a');
        a.href = src;
        a.textContent = src;
        iframe.replaceWith(a);
      });
      contentCell = body;
    } else {
      // Fallback: empty element
      contentCell = document.createElement('div');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create 2-col table with proper block header
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
