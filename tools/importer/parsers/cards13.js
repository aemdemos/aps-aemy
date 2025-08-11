/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract image url from anchor with background-image style and create <img>
  function createImgFromAnchor(aEl, titleAlt) {
    const style = aEl.getAttribute('style') || '';
    const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
    const url = match ? match[1].trim() : '';
    const img = document.createElement('img');
    img.src = url;
    img.alt = titleAlt || '';
    return img;
  }

  // Find the card list
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header EXACTLY as required
  const cells = [['Cards (cards13)']];

  // Process each card item
  Array.from(ul.children).forEach(li => {
    if (!li.classList.contains('cards__item')) return;
    const wrapper = li.querySelector('.item-wrapper');
    if (!wrapper) return;

    // Get image anchor and title (for alt text)
    const imageAnchor = wrapper.querySelector('.item-image');
    const contentDiv = wrapper.querySelector('.item-content');
    let title = '';
    let titleEl = null;
    if (contentDiv) {
      const h = contentDiv.querySelector('h3');
      if (h) {
        title = h.textContent.trim();
        titleEl = h;
      }
    }
    // First column: image
    let imgEl = null;
    if (imageAnchor) {
      imgEl = createImgFromAnchor(imageAnchor, title);
    }

    // Second column: text content
    const contentEls = [];
    if (titleEl) contentEls.push(titleEl);
    // Only push description if non-empty
    if (contentDiv) {
      const desc = contentDiv.querySelector('p');
      if (desc && desc.textContent.trim()) {
        contentEls.push(desc);
      }
      // Only push CTA link if it exists
      const link = contentDiv.querySelector('a');
      if (link) {
        contentEls.push(link);
      }
    }

    cells.push([
      imgEl,
      contentEls.length === 1 ? contentEls[0] : contentEls
    ]);
  });
  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}