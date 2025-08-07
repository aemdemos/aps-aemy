/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Locate all cards - this gets <li class="cards__item">
  const cardItems = element.querySelectorAll('.cards__item');

  cardItems.forEach((card) => {
    // ----- IMAGE CELL -----
    let imgEl = null;
    const imgLink = card.querySelector('.item-image');
    if (imgLink) {
      // background-image: url('src')
      const style = imgLink.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imgLink.getAttribute('alt') || '';
      }
    }

    // ----- TEXT CONTENT CELL -----
    const content = card.querySelector('.item-content');
    const cellContent = [];
    if (content) {
      // Title (use H3 for semantic consistency)
      const title = content.querySelector('.item-content__title');
      if (title) {
        // Reference the existing title element (as <h3>), but remove class for cleanliness
        const titleElement = title;
        titleElement.removeAttribute('class');
        cellContent.push(titleElement);
      }
      // Description
      const desc = content.querySelector('.item-content__desc');
      if (desc && desc.textContent.trim()) {
        cellContent.push(desc);
      }
      // CTA
      const cta = content.querySelector('.item-content__link');
      if (cta) {
        cellContent.push(cta);
      }
    }
    // Remove any empty text nodes or redundant whitespace
    const cleanCellContent = cellContent.filter(
      (el) => (typeof el === 'string' && el.trim()) || (el && el.textContent && el.textContent.trim())
    );
    rows.push([
      imgEl,
      cleanCellContent
    ]);
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
