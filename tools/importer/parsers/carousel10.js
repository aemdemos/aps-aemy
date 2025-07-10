/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the slides container
  const slidesList = element.querySelector('.glide__track ul.glide__slides');
  if (!slidesList) return;

  // 2. Get all unique slide <li> elements (dedupe by unique image src)
  const allSlides = Array.from(slidesList.children).filter(li => li.classList.contains('glide__slide'));
  const foundSrcs = new Set();
  const uniqueSlides = [];
  for (const li of allSlides) {
    const img = li.querySelector('img');
    if (!img) continue;
    const src = img.getAttribute('src');
    if (src && !foundSrcs.has(src)) {
      foundSrcs.add(src);
      uniqueSlides.push(li);
    }
  }

  // 3. Build the table
  const tableRows = [['Carousel (carousel10)']];

  for (const li of uniqueSlides) {
    // First cell: the image element itself (reference from DOM)
    let img = null;
    const imgLink = li.querySelector('.slide-wrapper > a');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // Second cell: reference all text content as a block from .slide-content (not clone)
    const content = li.querySelector('.slide-content');
    let cellContent = null;
    if (content) {
      // Upgrade h3 in place to h2 for heading, referencing existing DOM nodes
      const h3 = content.querySelector('h3');
      if (h3) {
        const h2 = document.createElement('h2');
        h2.innerHTML = h3.innerHTML;
        h3.replaceWith(h2);
      }
      cellContent = Array.from(content.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0));
    }
    tableRows.push([img, cellContent]);
  }

  // 4. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
