/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create an img from background-image style on anchor
  function bgStyleToImg(aEl) {
    const style = aEl.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].trim();
      img.alt = aEl.getAttribute('alt') || '';
      return img;
    }
    return '';
  }

  // Find the list of card elements
  const cardsList = element.querySelector('ul.cards__list');
  if (!cardsList) return;
  const cardEls = Array.from(cardsList.children).filter(li => li.classList.contains('cards__item'));

  const rows = [];
  // Header row
  rows.push(['Cards (cards24)']);

  // Card rows
  for (const cardEl of cardEls) {
    const wrapper = cardEl.querySelector('.item-wrapper');
    if (!wrapper) continue;

    // Left (image or blank)
    let imgCell = '';
    const imgAnchor = wrapper.querySelector('a.item-image');
    if (imgAnchor) {
      imgCell = bgStyleToImg(imgAnchor);
    }

    // Right (content)
    const contentDiv = wrapper.querySelector('.item-content');
    const contentParts = [];
    if (contentDiv) {
      // Title
      const titleEl = contentDiv.querySelector('.item-content__title');
      if (titleEl) contentParts.push(titleEl);
      // Description
      const descEl = contentDiv.querySelector('.item-content__desc');
      if (descEl) contentParts.push(descEl);
      // Link
      const linkEl = contentDiv.querySelector('.item-content__link');
      if (linkEl) contentParts.push(linkEl);
    }
    // Tag (span.coming or .featured) - put at end
    const tag = wrapper.querySelector('span.tag');
    if (tag) contentParts.push(tag);

    // If contentParts is empty, still provide an empty cell
    const textCell = contentParts.length > 1 ? contentParts : (contentParts[0] || '');
    rows.push([imgCell, textCell]);
  }

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
