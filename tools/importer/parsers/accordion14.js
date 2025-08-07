/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Accordion (accordion14)'];

  // Gather all accordion cards (each is one panel)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach((card) => {
    // Title: use the heading element inside card-header, fallback to card-header if needed
    const cardHeader = card.querySelector('.card-header');
    let titleElem = null;
    if (cardHeader) {
      // Use first heading or .h6/.h5/etc, fallback to all children if nothing matches
      titleElem = cardHeader.querySelector('h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6');
      if (!titleElem && cardHeader.childNodes.length > 0) {
        // If there's no heading, use everything inside cardHeader
        const span = document.createElement('span');
        cardHeader.childNodes.forEach((n) => span.appendChild(n.cloneNode(true)));
        titleElem = span;
      }
    }
    // Content: find .card-body inside .collapse (the expanded area)
    let contentElem = card.querySelector('.collapse .card-body, .card-body');
    if (!contentElem) {
      // fallback: if .card-body is missing, use .collapse or whole card
      contentElem = card.querySelector('.collapse') || card;
    }
    // Replace iframes with links to their src, as specified
    if (contentElem) {
      contentElem.querySelectorAll('iframe[src]').forEach((iframe) => {
        const href = iframe.getAttribute('src');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = href;
        iframe.replaceWith(a);
      });
    }
    // Push row as [title, content]
    rows.push([
      titleElem,
      contentElem
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
