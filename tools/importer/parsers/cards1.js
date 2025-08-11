/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Get all direct card items
  const cardItems = element.querySelectorAll('.cards__list > .cards__item');

  cardItems.forEach((card) => {
    // For image: find the 'a.item-image' and get the URL from style.backgroundImage
    const imageAnchor = card.querySelector('.item-image');
    let imgEl = null;
    if (imageAnchor) {
      const style = imageAnchor.getAttribute('style');
      // Extract url('...') from style string
      const match = style && style.match(/url\(['"]?(.*?)['"]?\)/);
      if (match) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imageAnchor.getAttribute('alt') || '';
      }
    }

    // For text cell: use the actual elements from the DOM
    const content = card.querySelector('.item-content');
    const textElements = [];
    if (content) {
      // Title
      const title = content.querySelector('.item-content__title');
      if (title) textElements.push(title);
      // Description
      const desc = content.querySelector('.item-content__desc');
      if (desc) textElements.push(desc);
      // CTA link
      const cta = content.querySelector('.item-content__link');
      if (cta) textElements.push(cta);
    }
    rows.push([
      imgEl,
      textElements
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
