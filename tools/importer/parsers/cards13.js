/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image URL from style
  function extractBgImageUrl(style) {
    if (!style) return '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    return match ? match[1].trim() : '';
  }

  const cardsList = element.querySelector('ul.cards__list');
  if (!cardsList) return;
  const rows = [];

  // Header row EXACT match
  rows.push(['Cards (cards13)']);

  cardsList.querySelectorAll(':scope > li.cards__item').forEach((card) => {
    // IMAGE
    const imgAnchor = card.querySelector('.item-image');
    let imageEl = '';
    if (imgAnchor) {
      const imgUrl = extractBgImageUrl(imgAnchor.getAttribute('style') || '');
      if (imgUrl) {
        imageEl = document.createElement('img');
        imageEl.src = imgUrl;
        imageEl.alt = imgAnchor.getAttribute('alt') || '';
      }
    }
    // TEXT CONTENT
    const contentDiv = card.querySelector('.item-content');
    const textContent = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.item-content__title');
      if (title) textContent.push(title);
      // Description: include even if empty (but insert only if not null)
      const desc = contentDiv.querySelector('.item-content__desc');
      // Fix: Always include the <p> description element, even if empty
      if (desc) textContent.push(desc);
      // CTA link
      const link = contentDiv.querySelector('.item-content__link');
      if (link) textContent.push(link);
    }
    rows.push([
      imageEl,
      textContent.length > 0 ? textContent : '',
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
