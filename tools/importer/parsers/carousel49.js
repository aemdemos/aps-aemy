/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slides container
  const track = element.querySelector('.glide__track > ul');
  if (!track) return;

  // Get all 'li' slides (for robustness), covering clones and actual slides
  let slides = Array.from(track.querySelectorAll(':scope > li'));

  // Deduplicate by image src to avoid clones (order preserved)
  const seen = new Set();
  const dedupedSlides = [];
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img && !seen.has(img.src)) {
      seen.add(img.src);
      dedupedSlides.push(slide);
    }
  });

  // Build table rows
  const rows = [];
  // Header row: must match example exactly
  rows.push(['Carousel']);

  dedupedSlides.forEach(slide => {
    const wrapper = slide.querySelector('.slide-wrapper');
    if (!wrapper) return;

    // First cell: reference the <img> element as is
    const imgEl = wrapper.querySelector('img');

    // Second cell: collect all direct child elements and text from .slide-content
    const content = wrapper.querySelector('.slide-content');
    const cellEls = [];
    if (content) {
      // For each direct node
      Array.from(content.childNodes).forEach(node => {
        // Reference live elements (not clones) if element, preserve order
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          cellEls.push(node);
        }
      });
    }
    rows.push([
      imgEl,
      cellEls.length === 1 ? cellEls[0] : (cellEls.length > 1 ? cellEls : '')
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
