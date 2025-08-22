/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Find main track and slides <ul>
  const track = element.querySelector('.glide__track');
  const ul = track && track.querySelector('ul');
  if (!ul) return;

  // To avoid duplicate cards by image src
  const seen = new Set();
  // Only non-clone slides
  const liCards = Array.from(ul.querySelectorAll('li.glide__slide:not(.glide__slide--clone)'));

  liCards.forEach(li => {
    // Get image (first img in card)
    const img = li.querySelector('img');
    if (!img || seen.has(img.src)) return;
    seen.add(img.src);

    // Get card content (text cell)
    const content = li.querySelector('.slide-content');
    if (!content) return;

    // To ensure all text content is included and semantic meaning preserved,
    // we reference the existing children of .slide-content directly.
    // This includes heading, description, and CTA link if present.
    // We do NOT clone, just reference.
    const textCell = [];
    Array.from(content.children).forEach(child => {
      textCell.push(child);
    });

    // Only push row if both img and textCell have content
    if (img && textCell.length) {
      rows.push([img, textCell]);
    }
  });

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
