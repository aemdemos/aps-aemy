/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as required by the block description and example
  const headerRow = ['Cards (cards13)'];

  // Find the UL containing the cards
  const ul = element.querySelector('ul.cards__list');
  if (!ul) return;

  // Get all LI card items
  const items = Array.from(ul.children).filter(li => li.classList.contains('cards__item'));
  const rows = [headerRow];

  items.forEach((li) => {
    // Card image (background-image on <a>)
    const imageLink = li.querySelector('.item-image');
    let imgEl = null;
    if (imageLink) {
      const style = imageLink.getAttribute('style') || '';
      // Regex to pull out the first background-image URL
      const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imageLink.getAttribute('alt') || '';
      }
    }

    // Card text
    const contentDiv = li.querySelector('.item-content');
    const textContent = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.item-content__title');
      if (title && title.textContent.trim().length > 0) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.push(strong);
      }
      // Description (empty in this source, but must handle)
      const desc = contentDiv.querySelector('.item-content__desc');
      if (desc && desc.textContent.trim().length > 0) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textContent.push(p);
      }
      // CTA link
      const cta = contentDiv.querySelector('.item-content__link');
      if (cta) {
        textContent.push(cta); // already an <a>, reference not clone
      }
    }
    rows.push([imgEl, textContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
