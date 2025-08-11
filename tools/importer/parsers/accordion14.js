/* global WebImporter */
export default function parse(element, { document }) {
  // Header: block name exactly as required
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Find all top-level cards in the accordion
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // TITLE: .card-header > h2 (or fallback to all .card-header text)
    let titleCell = null;
    const header = card.querySelector('.card-header');
    if (header) {
      // prefer direct heading element
      const heading = header.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleCell = heading;
      } else {
        // fallback: use all text as a div
        const div = document.createElement('div');
        div.textContent = header.textContent.trim();
        titleCell = div;
      }
    } else {
      // fallback: blank cell
      titleCell = document.createElement('div');
    }

    // CONTENT: .collapse > .card-body (reference the element directly)
    let contentCell = card.querySelector('.collapse > .card-body');
    if (!contentCell) {
      contentCell = card.querySelector('.collapse');
    }
    // Defensive fallback: if even .collapse not found, create an empty div
    if (!contentCell) {
      contentCell = document.createElement('div');
    }
    // TRANSFORM: Replace all iframes (not images) with anchor links to src
    contentCell.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.src) {
        const a = document.createElement('a');
        a.href = iframe.src;
        a.textContent = iframe.src;
        iframe.replaceWith(a);
      }
    });
    rows.push([titleCell, contentCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
