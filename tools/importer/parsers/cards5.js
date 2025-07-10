/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block
  const cardsWrapper = element.querySelector('.cards__wrapper');
  if (!cardsWrapper) return;
  const cardsList = cardsWrapper.querySelector('.cards__list');
  if (!cardsList) return;

  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  const cards = Array.from(cardsList.querySelectorAll(':scope > .cards__item'));
  cards.forEach(card => {
    // Image cell
    let imgEl = null;
    const imgLink = card.querySelector('.item-image');
    if (imgLink) {
      const style = imgLink.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        // For alt, use the card title if available
        const h3 = card.querySelector('.item-content__title');
        imgEl.alt = h3 ? h3.textContent.trim() : 'Card image';
      }
    }
    // Text cell
    const textParts = [];
    const h3 = card.querySelector('.item-content__title');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent.trim();
      textParts.push(strong);
    }
    const desc = card.querySelector('.item-content__desc');
    if (desc) {
      if (textParts.length > 0) textParts.push(document.createElement('br'));
      textParts.push(document.createTextNode(desc.textContent.trim()));
    }
    const cta = card.querySelector('.item-content__link');
    if (cta) {
      if (textParts.length > 0) textParts.push(document.createElement('br'));
      textParts.push(cta);
    }
    rows.push([imgEl, textParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  cardsWrapper.replaceWith(table);
}
