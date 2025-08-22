/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow];

  // Find all cards
  const cardsList = element.querySelector('ul.cards__list');
  if (cardsList) {
    const cardItems = cardsList.querySelectorAll('li.cards__item');
    cardItems.forEach((li) => {
      // --- IMAGE CELL ---
      let imageCell = '';
      const imageLink = li.querySelector('.item-wrapper > a.item-image');
      if (imageLink) {
        // Get image url from style
        const bgStyle = imageLink.getAttribute('style') || '';
        const match = bgStyle.match(/url\(['"]?(.*?)['"]?\)/);
        const imageUrl = match ? match[1].trim() : '';
        if (imageUrl) {
          // Use a single <img> element per requirements
          const imgEl = document.createElement('img');
          imgEl.src = imageUrl;
          imgEl.alt = imageLink.getAttribute('alt') || '';
          imageCell = imgEl;
        }
      }
      // --- CONTENT CELL ---
      const contentDiv = li.querySelector('.item-wrapper > .item-content');
      const contentParts = [];
      if (contentDiv) {
        // Title
        const titleEl = contentDiv.querySelector('.item-content__title');
        if (titleEl) contentParts.push(titleEl);
        // Description (rarely present in this HTML, but included for robustness)
        const descEl = contentDiv.querySelector('.item-content__desc');
        if (descEl && descEl.textContent.trim()) contentParts.push(descEl);
        // CTA Link
        const ctaLinkEl = contentDiv.querySelector('.item-content__link');
        if (ctaLinkEl) contentParts.push(ctaLinkEl);
      }
      // Add row: always two columns, image and text parts
      cells.push([imageCell, contentParts]);
    });
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
