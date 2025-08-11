/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow];

  // Find all card items
  const ul = element.querySelector('ul.cards__list');
  if (!ul) return;
  const liList = Array.from(ul.children).filter(li => li.classList.contains('cards__item'));

  liList.forEach(li => {
    // Get wrapper
    const wrapper = li.querySelector('.item-wrapper');
    if (!wrapper) {
      cells.push(['', '']);
      return;
    }

    // --- Image Cell ---
    let imageCell = '';
    const imgLink = wrapper.querySelector('.item-image');
    if (imgLink && imgLink.style && imgLink.style.backgroundImage) {
      const bgUrlMatch = imgLink.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
      if (bgUrlMatch && bgUrlMatch[1]) {
        const img = document.createElement('img');
        img.src = bgUrlMatch[1].trim();
        img.alt = imgLink.getAttribute('alt') || '';
        imageCell = img;
      }
    }

    // --- Text Cell ---
    const content = wrapper.querySelector('.item-content');
    const textContentArr = [];
    if (content) {
      const title = content.querySelector('.item-content__title');
      if (title) {
        // Use <strong> to match visual weight
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        textContentArr.push(strong);
      }
      // Description
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        if (textContentArr.length) textContentArr.push(document.createElement('br'));
        textContentArr.push(desc);
      }
      // Call-to-action link
      const link = content.querySelector('.item-content__link');
      if (link) {
        if (textContentArr.length) textContentArr.push(document.createElement('br'));
        textContentArr.push(link);
      }
    }
    // Tag/badge
    const tag = wrapper.querySelector('span.tag');
    if (tag) {
      // Only add a badge line if there's content
      if (textContentArr.length) textContentArr.push(document.createElement('br'));
      textContentArr.push(tag);
    }

    // If textContentArr is empty, use empty string
    const textCell = textContentArr.length ? textContentArr : '';
    cells.push([imageCell, textCell]);
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
