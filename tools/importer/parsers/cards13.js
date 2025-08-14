/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const cells = [['Cards (cards13)']];

  // Find the cards list
  const ul = element.querySelector('ul.cards__list');
  if (ul) {
    const lis = ul.querySelectorAll(':scope > li.cards__item');
    lis.forEach((li) => {
      // Image cell: extract from .item-image background-image
      const imageLink = li.querySelector('.item-image');
      let imageEl = '';
      if (imageLink && imageLink.style && imageLink.style.backgroundImage) {
        const bg = imageLink.style.backgroundImage;
        const urlMatch = bg.match(/url\(['"]?([^'"]+)['"]?\)/i);
        if (urlMatch && urlMatch[1]) {
          const img = document.createElement('img');
          img.src = urlMatch[1].trim();
          img.alt = imageLink.getAttribute('alt') || '';
          imageEl = img;
        }
      }

      // Text cell: build content
      const content = li.querySelector('.item-content');
      const textParts = [];
      if (content) {
        const title = content.querySelector('.item-content__title');
        if (title && title.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = title.textContent.trim();
          textParts.push(strong);
        }
        // The description is optional
        const desc = content.querySelector('.item-content__desc');
        if (desc && desc.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textParts.push(p);
        }
        // The CTA link
        const cta = content.querySelector('.item-content__link');
        if (cta) {
          textParts.push(cta);
        }
      }
      // Always include two columns per row
      cells.push([
        imageEl || '',
        textParts.length ? textParts : '',
      ]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
