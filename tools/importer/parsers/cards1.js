/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const cells = [['Cards (cards1)']];

  // Find all top-level card items
  const ul = element.querySelector('ul.cards__list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cards__item');

  items.forEach((item) => {
    // --- Image cell: ---
    // The 'a.item-image' contains a background-image. Extract URL, create <img>.
    // alt should be carried over if present.
    const imageLink = item.querySelector('.item-image');
    let imgEl = null;
    if (imageLink) {
      const style = imageLink.getAttribute('style') || '';
      // Extract the URL from the background-image
      const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imageLink.getAttribute('alt') || '';
      }
    }

    // --- Text cell: ---
    // Reference child elements directly.
    const content = item.querySelector('.item-content');
    const partList = [];
    if (content) {
      const title = content.querySelector('.item-content__title');
      if (title) {
        // Use strong instead of h3 to match example's bold heading style
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        partList.push(strong);
      }
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        // Add line break if title exists and then description
        if (partList.length) partList.push(document.createElement('br'));
        partList.push(desc);
      }
      const link = content.querySelector('.item-content__link');
      if (link) {
        // Add line break before CTA if desc/title exists
        if (partList.length) partList.push(document.createElement('br'));
        partList.push(link);
      }
    }

    // Ensure table row for each card, image in cell 1, text block in cell 2
    cells.push([
      imgEl,
      partList
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
