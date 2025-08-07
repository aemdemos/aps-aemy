/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get unique slides by image src
  function getUniqueSlides(slides) {
    const seen = new Set();
    const unique = [];
    slides.forEach(li => {
      const img = li.querySelector('img');
      if (img) {
        const src = img.getAttribute('src');
        if (!seen.has(src)) {
          seen.add(src);
          unique.push(li);
        }
      }
    });
    return unique;
  }

  // 1. Get the list of slides
  const ul = element.querySelector('.glide__slides');
  if (!ul) return;
  const allSlides = Array.from(ul.children).filter(li => li.classList.contains('glide__slide'));
  const slides = getUniqueSlides(allSlides);

  // 2. Prepare table rows
  const rows = [['Cards (cards25)']];
  slides.forEach(slide => {
    // Image cell: the first <img> inside .slide-wrapper
    const wrapper = slide.querySelector('.slide-wrapper');
    if (!wrapper) return;
    const image = wrapper.querySelector('img');
    // Text cell: reference the .slide-content node directly to include all content
    const textContent = wrapper.querySelector('.slide-content');
    // Defensive: only add row if both image and textContent exist
    if (image && textContent) {
      rows.push([image, textContent]);
    }
  });

  // 3. Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
