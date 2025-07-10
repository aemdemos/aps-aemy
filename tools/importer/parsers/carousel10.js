/* global WebImporter */
export default function parse(element, { document }) {
  // The table header must match the example exactly
  const headerRow = ['Carousel (carousel10)'];
  const cells = [headerRow];
  // Find the slides list
  const slidesList = element.querySelector('ul.glide__slides');
  if (!slidesList) return;
  // Only non-clone slides
  const slides = Array.from(slidesList.children).filter(
    li => li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone')
  );
  slides.forEach(slide => {
    // First cell: first <img> in slide
    const img = slide.querySelector('img');
    const imgCell = img || '';
    // Second cell: all text content from .slide-content, preserving semantic HTML
    const content = slide.querySelector('.slide-content');
    let textCell = '';
    if (content) {
      // Gather heading, paragraph, and link, using existing elements, not clones
      const items = [];
      // Use .children to preserve element nodes only
      for (const child of content.children) {
        // If heading, keep as is; if paragraph, keep as is; if link, keep as is
        if (
          child.tagName.toLowerCase() === 'h3' ||
          child.tagName.toLowerCase() === 'h2' ||
          child.tagName.toLowerCase() === 'h1' ||
          child.tagName.toLowerCase() === 'p' ||
          child.tagName.toLowerCase() === 'a'
        ) {
          items.push(child);
        }
      }
      // If we have items, textCell is the array, else ''
      textCell = items.length ? items : '';
    }
    cells.push([imgCell, textCell]);
  });
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
