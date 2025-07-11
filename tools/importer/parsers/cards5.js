/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards wrapper
  let cardsWrapper = element.querySelector('.cards__wrapper');
  if (element.classList.contains('cards__wrapper')) {
    cardsWrapper = element;
  }
  if (!cardsWrapper) return;
  const cardsList = cardsWrapper.querySelector('.cards__list');
  if (!cardsList) return;

  // Prepare block table: header matches example
  const rows = [['Cards (cards5)']];

  // Process each card
  cardsList.querySelectorAll('.cards__item').forEach((cardItem) => {
    // First cell: image extracted from background-image style
    const imageLink = cardItem.querySelector('.item-image');
    let imgElem = '';
    if (imageLink) {
      const bgStyle = imageLink.getAttribute('style') || '';
      const match = bgStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1].trim();
        const alt = imageLink.getAttribute('alt');
        if (alt) img.alt = alt;
        imgElem = img;
      }
    }

    // Second cell: structure is [title (strong), description, CTA link]
    const contentDiv = cardItem.querySelector('.item-content');
    const content = [];

    if (contentDiv) {
      // Title as <strong>
      const title = contentDiv.querySelector('.item-content__title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        content.push(strong);
      }
      // Description as paragraph
      const desc = contentDiv.querySelector('.item-content__desc');
      if (desc && desc.textContent.trim()) {
        if (content.length) content.push(document.createElement('br'));
        content.push(desc);
      }
      // CTA link
      const cta = contentDiv.querySelector('.item-content__link');
      if (cta) {
        if (content.length) content.push(document.createElement('br'));
        content.push(cta);
      }
    }
    // Remove leading/trailing breaks if present
    while (content.length && content[0].tagName === 'BR') content.shift();
    while (content.length && content[content.length - 1].tagName === 'BR') content.pop();

    rows.push([
      imgElem,
      content.length === 1 ? content[0] : content
    ]);
  });

  // Create and insert table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  cardsWrapper.replaceWith(table);
}
