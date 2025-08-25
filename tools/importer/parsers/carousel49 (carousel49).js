/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slides container
  const slidesList = element.querySelector('.glide__slides');
  if (!slidesList) return;

  // Select all unique slides (deduplicate by image src)
  const allSlides = Array.from(slidesList.querySelectorAll('li.glide__slide'));
  const seenSrcs = new Set();
  const slides = [];
  allSlides.forEach(li => {
    const img = li.querySelector('img');
    if (img && !seenSrcs.has(img.src)) {
      seenSrcs.add(img.src);
      slides.push(li);
    }
  });

  // Table header row: exactly as in the example
  const rows = [['Carousel']];

  slides.forEach(slideLi => {
    // Column 1: image element (reference, not clone)
    const img = slideLi.querySelector('img');
    // Column 2: all text content, properly referencing elements and preserving semantics
    const content = slideLi.querySelector('.slide-content');
    const cellContent = [];
    if (content) {
      // Heading (h3), converted to h2 for the block and referenced, not cloned
      const h3 = content.querySelector('.slide-content__title');
      if (h3) {
        // Create h2, but use the text from h3
        const h2 = document.createElement('h2');
        h2.textContent = h3.textContent;
        cellContent.push(h2);
      }
      // Description (p)
      const desc = content.querySelector('.slide-content__desc');
      if (desc) {
        cellContent.push(desc);
      }
      // CTA link (a)
      const cta = content.querySelector('.slide-content__link');
      if (cta) {
        // Add a <br> before CTA if there is other content
        if (cellContent.length > 0) {
          cellContent.push(document.createElement('br'));
        }
        cellContent.push(cta);
      }
    }
    // If no content, use empty string
    rows.push([
      img,
      cellContent.length ? cellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
