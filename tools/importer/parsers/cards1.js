/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the URL from background-image style
  function extractImageFromStyle(style) {
    if (!style) return null;
    const match = style.match(/url\((['"]?)(.*?)\1\)/);
    if (match && match[2]) {
      const img = document.createElement('img');
      img.src = match[2].trim();
      img.alt = '';
      return img;
    }
    return null;
  }

  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];
  const ul = element.querySelector('ul.cards__list');
  if (!ul) return;

  Array.from(ul.children).forEach((li) => {
    const wrapper = li.querySelector('.item-wrapper');
    // First cell: Image
    let imgCell = null;
    const imgLink = wrapper && wrapper.querySelector('.item-image');
    if (imgLink) {
      const img = extractImageFromStyle(imgLink.getAttribute('style'));
      if (img) imgCell = img;
    }

    // Second cell: Title, Description, CTA in a fragment
    const content = wrapper && wrapper.querySelector('.item-content');
    const frag = document.createDocumentFragment();
    if (content) {
      // Title
      const title = content.querySelector('.item-content__title');
      if (title) {
        frag.appendChild(title);
      }
      // Description
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        frag.appendChild(desc);
      }
      // CTA/link
      const cta = content.querySelector('.item-content__link');
      if (cta) {
        frag.appendChild(cta);
      }
    }

    rows.push([imgCell, frag]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
