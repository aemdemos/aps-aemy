/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards1) header row - matches example exactly
  const cells = [['Cards (cards1)']];

  // Find the slides list (ul.glide__slides)
  const slidesList = element.querySelector('ul.glide__slides');
  if (!slidesList) return;

  // Only use real slides (ignore clones)
  const slides = Array.from(slidesList.children)
    .filter(li => li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone'));

  slides.forEach(slide => {
    // First cell: image (reference existing img)
    const img = slide.querySelector('img');
    // Second cell: full .slide-content (reference existing element for all text/links)
    const content = slide.querySelector('.slide-content');
    // Edge case: If no .slide-content, fallback to all text content in slide-wrapper
    let textCell = content || '';
    if (!content) {
      const wrapper = slide.querySelector('.slide-wrapper');
      if (wrapper) {
        textCell = wrapper;
      } else {
        // fallback to slide's own text
        textCell = document.createTextNode(slide.textContent.trim());
      }
    }
    cells.push([img || '', textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
