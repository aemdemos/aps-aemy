/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel track which contains the list of slides
  const track = element.querySelector('.glide__track');
  if (!track) return;
  const slidesList = track.querySelector('ul.glide__slides');
  if (!slidesList) return;

  // Get all non-clone slides as the main cards (avoid duplicates)
  let slides = Array.from(slidesList.children).filter(li => li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone'));

  // Fallback: if all are clones, deduplicate by image src + text content
  if (slides.length === 0) {
    const allSlides = Array.from(slidesList.children).filter(li => li.classList.contains('glide__slide'));
    const seen = new Set();
    slides = allSlides.filter(li => {
      const img = li.querySelector('img');
      const textBlock = li.querySelector('.slide-content');
      const textKey = textBlock ? textBlock.innerText.trim() : '';
      const key = (img ? img.src : '') + '|' + textKey;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Table: first row is header, subsequent are cards
  const table = [['Cards (cards25)']];

  slides.forEach(slide => {
    // Image cell: always use the referenced <img> element (not string)
    const imageCell = slide.querySelector('img') || '';
    // Text cell: reference the full content block for best resiliency
    const textCell = slide.querySelector('.slide-content') || '';
    table.push([imageCell, textCell]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
