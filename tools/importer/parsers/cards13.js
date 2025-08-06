/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per specification
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  // Find the list of cards
  const ul = element.querySelector('ul.cards__list');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li.cards__item');

  lis.forEach((li) => {
    const itemWrapper = li.querySelector('.item-wrapper');

    // --- IMAGE CELL ---
    let imgEl = null;
    const anchor = itemWrapper.querySelector('a.item-image');
    if (anchor) {
      const style = anchor.getAttribute('style') || '';
      const urlMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (urlMatch && urlMatch[1]) {
        imgEl = document.createElement('img');
        imgEl.src = urlMatch[1].trim();
        imgEl.alt = anchor.getAttribute('alt') || '';
        imgEl.loading = 'lazy';
      }
    }

    // --- TEXT CELL ---
    const contentDiv = itemWrapper.querySelector('.item-content');
    const cellContent = [];

    // Title: strong element, preserve semantics
    const titleEl = contentDiv.querySelector('.item-content__title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      cellContent.push(strong);
    }

    // Description: only if non-empty
    const descEl = contentDiv.querySelector('.item-content__desc');
    if (descEl && descEl.textContent.trim()) {
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(document.createTextNode(descEl.textContent.trim()));
    }

    // CTA link: only if exists
    const ctaEl = contentDiv.querySelector('.item-content__link');
    if (ctaEl) {
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(ctaEl);
    }

    // If cellContent is empty, add a non-breaking space to visually preserve cell
    if (cellContent.length === 0) {
      cellContent.push(document.createTextNode('\u00A0'));
    }

    rows.push([
      imgEl,  // null is fine, createTable will still work
      cellContent.length === 1 ? cellContent[0] : cellContent,
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
