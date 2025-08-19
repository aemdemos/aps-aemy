/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows
  const cells = [['Cards (cards1)']];

  // Find the slides container
  const slidesContainer = element.querySelector('.glide__track ul.glide__slides');
  if (!slidesContainer) return;

  // Use a Set to avoid duplicate cards (clones)
  const seen = new Set();
  // Get all li elements that are direct children of the slides container
  const slides = Array.from(slidesContainer.children);

  for (const slide of slides) {
    const img = slide.querySelector('img');
    if (!img) continue;
    // Use image src as unique key to avoid duplicates
    if (seen.has(img.src)) continue;
    seen.add(img.src);

    // First column: image element
    const imageCell = img;

    // Second column: reference the whole .slide-content div so all text is preserved
    let textCell;
    const contentDiv = slide.querySelector('.slide-content');
    if (contentDiv) {
      textCell = contentDiv;
    } else {
      // fallback: if no .slide-content, aggregate all non-image children
      const textFragments = [];
      Array.from(slide.children).forEach(child => {
        if (child !== img) textFragments.push(child);
      });
      textCell = textFragments.length ? textFragments : '';
    }
    cells.push([imageCell, textCell]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
