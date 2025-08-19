/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background-image url from style string
  function getBackgroundImageUrl(style) {
    const match = style && style.match(/background-image:\s*url\(['"]?([^'"]+)["']?\s*\)/);
    return match ? match[1].trim() : null;
  }

  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow];

  const list = element.querySelector('.cards__list');
  if (!list) return;
  const items = Array.from(list.children);
  items.forEach(card => {
    const wrapper = card.querySelector('.item-wrapper');
    if (!wrapper) return;

    // --- IMAGE CELL ---
    let imgEl = null;
    const imageLink = wrapper.querySelector('.item-image');
    if (imageLink) {
      const imgUrl = getBackgroundImageUrl(imageLink.getAttribute('style'));
      if (imgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = imgUrl;
        imgEl.alt = imageLink.getAttribute('alt') || '';
      }
    }

    // --- TEXT CELL ---
    const content = wrapper.querySelector('.item-content');
    const textCell = document.createElement('div'); // To preserve structure and allow block elements
    if (content) {
      // Title (h3 as strong)
      const titleEl = content.querySelector('.item-content__title');
      if (titleEl && titleEl.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        textCell.appendChild(strong);
      }
      // Description (p)
      const descEl = content.querySelector('.item-content__desc');
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        textCell.appendChild(p);
      }
      // CTA link
      const ctaEl = content.querySelector('.item-content__link');
      if (ctaEl && ctaEl.textContent.trim()) {
        textCell.appendChild(ctaEl);
      }
    }
    // If textCell is empty, use ''
    const textCellContent = textCell.childNodes.length ? textCell : '';
    cells.push([imgEl, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
