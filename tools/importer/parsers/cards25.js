/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slides container (ul.glide__slides)
  const slidesContainer = element.querySelector('.glide__track ul.glide__slides');
  if (!slidesContainer) return;

  // Get all unique (non-clone) slides
  const slides = Array.from(slidesContainer.children)
    .filter(li => li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone'));

  // Table header row as in the example
  const rows = [['Cards (cards25)']];

  // For each slide, extract image and text content
  slides.forEach(slide => {
    const wrapper = slide.querySelector('.slide-wrapper');
    if (!wrapper) return;

    // Image cell: reference the <img> element directly if present
    let imageCell = '';
    const img = wrapper.querySelector('img');
    if (img) imageCell = img;

    // Text cell: gather all children of .slide-content, using original elements
    let textCell = '';
    const content = wrapper.querySelector('.slide-content');
    if (content) {
      // Gather all element and text nodes (preserves order and formatting)
      const nodes = Array.from(content.childNodes).filter(node => {
        // Skip empty text nodes
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
        return true;
      });
      textCell = nodes.length > 1 ? nodes : (nodes[0] || '');
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
