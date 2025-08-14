/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards1)'];
  const cells = [headerRow];

  // Find the list of cards
  const list = element.querySelector('ul.cards__list');
  if (!list) return;
  const items = list.querySelectorAll('li.cards__item');

  items.forEach((item) => {
    // 1st cell: image from background-image
    const imageLink = item.querySelector('.item-image');
    let imgEl = null;
    if (imageLink) {
      const style = imageLink.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imageLink.getAttribute('alt') || '';
      }
    }

    // 2nd cell: text content (title, description, CTA)
    const content = item.querySelector('.item-content');
    const textCell = [];
    if (content) {
      const title = content.querySelector('.item-content__title');
      if (title) {
        textCell.push(title); // direct reference, not cloning
      }
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        textCell.push(desc); // direct reference
      }
      const link = content.querySelector('.item-content__link');
      if (link) {
        textCell.push(link); // direct reference
      }
    }

    // Only add the row if there is image or text
    if (imgEl || textCell.length) {
      cells.push([
        imgEl,
        textCell
      ]);
    }
  });
  // Create and replace the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
