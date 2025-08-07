/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create <img> from a background-image style attribute on an <a>
  function createImageFromBg(aEl) {
    const style = aEl.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].trim();
      img.alt = aEl.getAttribute('alt') || '';
      return img;
    }
    return null;
  }

  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find all cards
  const list = element.querySelector('ul.cards__list');
  if (!list) return;

  const items = Array.from(list.children).filter(li => li.classList.contains('cards__item'));

  items.forEach((li) => {
    const wrapper = li.querySelector('.item-wrapper');

    // IMAGE cell (may be empty)
    let imgCell = null;
    const imageLink = wrapper && wrapper.querySelector('.item-image');
    if (imageLink) {
      imgCell = createImageFromBg(imageLink);
    }

    // TEXT cell
    const textContentEls = [];
    const itemContent = wrapper ? wrapper.querySelector('.item-content') : null;
    if (itemContent) {
      // Title
      const title = itemContent.querySelector('.item-content__title');
      if (title) textContentEls.push(title);
      // Description
      const desc = itemContent.querySelector('.item-content__desc');
      if (desc) textContentEls.push(desc);
      // CTA
      const cta = itemContent.querySelector('.item-content__link');
      if (cta) textContentEls.push(cta);
    }
    // Feature/coming soon tag (visually important, should appear last)
    const tag = wrapper ? wrapper.querySelector('.tag') : null;
    if (tag) textContentEls.push(tag);

    // Always provide 2 cells for each row
    rows.push([
      imgCell,
      textContentEls.length === 1 ? textContentEls[0] : textContentEls
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
