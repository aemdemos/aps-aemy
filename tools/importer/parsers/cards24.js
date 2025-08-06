/* global WebImporter */
export default function parse(element, { document }) {
  // Header per spec
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find all cards
  const list = element.querySelector('ul.cards__list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cards__item');

  items.forEach((item) => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const imgAnchor = item.querySelector('.item-image');
    if (imgAnchor && imgAnchor.style.backgroundImage) {
      // Extract URL from background-image: url('...')
      const bg = imgAnchor.style.backgroundImage;
      const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imgAnchor.getAttribute('alt') || '';
      }
    }
    // If there is no image (e.g. final card), imgEl remains null

    // --- TEXT CELL ---
    let textCell = [];
    const content = item.querySelector('.item-content');
    if (content) {
      // Title (h3)
      const h3 = content.querySelector('h3');
      if (h3) {
        // Use <strong> to match bold title in sample
        const strong = document.createElement('strong');
        strong.innerHTML = h3.innerHTML;
        textCell.push(strong);
        // Add <br> if there is more content
        if (content.querySelector('p, a')) {
          textCell.push(document.createElement('br'));
        }
      }
      // Description (p)
      const p = content.querySelector('p');
      if (p) {
        textCell.push(p);
        // Add <br> if there is a CTA link
        if (content.querySelector('a')) {
          textCell.push(document.createElement('br'));
        }
      }
      // CTA link
      const cta = content.querySelector('a');
      if (cta) {
        textCell.push(cta);
      }
    }
    // Tag (e.g. 'Featured', 'Coming Soon')
    const tag = item.querySelector('.tag');
    if (tag) {
      // Place tag on its own line after all content
      textCell.push(document.createElement('br'));
      textCell.push(tag);
    }
    // Remove leading or trailing <br> if present
    while (textCell[0] && textCell[0].tagName === 'BR') textCell.shift();
    while (textCell[textCell.length-1] && textCell[textCell.length-1].tagName === 'BR') textCell.pop();
    // If textCell is empty, use empty string
    const row = [imgEl, textCell.length === 0 ? '' : (textCell.length === 1 ? textCell[0] : textCell)];
    rows.push(row);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
