/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from <a> with background-image style
  function extractImageFromLink(linkEl) {
    if (!linkEl) return null;
    const style = linkEl.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'"\)]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].trim();
      // Use the next element sibling or fallback to empty alt
      img.alt = linkEl.getAttribute('alt') || '';
      return img;
    }
    return null;
  }

  // Get all cards
  const cardsList = element.querySelector('.cards__list');
  const cardItems = cardsList ? Array.from(cardsList.children) : [];

  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    const wrapper = li.querySelector('.item-wrapper');
    if (!wrapper) return;

    // Image/Icon (first cell)
    const imageLink = wrapper.querySelector('.item-image');
    const imgEl = extractImageFromLink(imageLink);
    let imageCell = '';
    if (imgEl) imageCell = imgEl;

    // Text content (second cell)
    const content = wrapper.querySelector('.item-content');
    let textCell = '';
    if (content) {
      const cellFragments = [];
      // Title as <strong>
      const title = content.querySelector('.item-content__title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        cellFragments.push(strong);
        cellFragments.push(document.createElement('br'));
      }
      // Description (as-is)
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        cellFragments.push(desc);
        cellFragments.push(document.createElement('br'));
      }
      // Call To Action link
      const link = content.querySelector('.item-content__link');
      if (link) {
        cellFragments.push(link);
      }
      // Remove trailing <br> if present
      if (cellFragments.length && cellFragments[cellFragments.length - 1].tagName === 'BR') {
        cellFragments.pop();
      }
      textCell = cellFragments;
    }
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
