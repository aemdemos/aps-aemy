/* global WebImporter */
export default function parse(element, { document }) {
  // Find card list
  const list = element.querySelector('ul.cards__list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cards__item');
  const rows = [['Cards (cards13)']];
  items.forEach((item) => {
    // Image handling
    let imgEl = null;
    const imgLink = item.querySelector('.item-image');
    if (imgLink) {
      const style = imgLink.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imgLink.getAttribute('alt') || '';
      }
    }
    // Content handling
    const contentDiv = item.querySelector('.item-content');
    const contentNodes = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.item-content__title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        contentNodes.push(strong);
      }
      // Description (not present in this dataset, but handled in case)
      const desc = contentDiv.querySelector('.item-content__desc');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentNodes.push(p);
      }
      // CTA link
      const cta = contentDiv.querySelector('.item-content__link');
      if (cta) {
        contentNodes.push(cta);
      }
    }
    rows.push([imgEl, contentNodes]);
  });
  // Replace the element with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
