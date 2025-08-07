/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const cells = [
    ['Cards (cards1)']
  ];

  // Find all card items
  const list = element.querySelector('ul.cards__list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cards__item');

  items.forEach((item) => {
    // --- IMAGE ---
    let imgEl = null;
    const imageLink = item.querySelector('.item-image');
    if (imageLink) {
      const style = imageLink.getAttribute('style') || '';
      const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        // Use the card title for alt, fallback to empty string
        const title = item.querySelector('.item-content__title');
        imgEl.alt = title ? title.textContent.trim() : '';
      }
    }

    // --- TEXT CONTENT ---
    const content = item.querySelector('.item-content');
    // We'll use a fragment to assemble the contents
    const frag = document.createDocumentFragment();
    if (content) {
      // Title as <strong>, as in the example
      const title = content.querySelector('.item-content__title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        frag.appendChild(strong);
        frag.appendChild(document.createElement('br'));
      }

      // Description as <p>
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        frag.appendChild(p);
      }

      // Call to action link, as a regular <a> (no list)
      const cta = content.querySelector('.item-content__link');
      if (cta) {
        // Reference the existing element
        frag.appendChild(cta);
      }
    }

    // Add row: [img, text]
    cells.push([
      imgEl,
      frag
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
