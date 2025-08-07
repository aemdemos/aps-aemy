/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slides container
  const glide = element.querySelector('.glide');
  if (!glide) return;
  const track = glide.querySelector('.glide__track');
  if (!track) return;
  const slidesList = track.querySelector('ul.glide__slides');
  if (!slidesList) return;

  // Get all original slides (ignore clones)
  const slides = Array.from(slidesList.children).filter(li =>
    li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone')
  );

  // Deduplicate using the combined text of .slide-content
  const seen = new Set();
  const rows = [];

  for (const li of slides) {
    const wrapper = li.querySelector('.slide-wrapper');
    if (!wrapper) continue;
    // Image (first <img> in the wrapper)
    const img = wrapper.querySelector('img');
    // Use .slide-content if available, else the wrapper itself
    const content = wrapper.querySelector('.slide-content') || wrapper;
    // Reference child elements directly (not clones)
    const textChildren = [];
    Array.from(content.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        textChildren.push(node);
      }
    });
    if (textChildren.length === 0) continue;
    // Deduplicate by full text content
    const dedupeKey = textChildren.map(n => n.textContent).join(' ').trim();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    // Compose the text cell as an array of direct references
    rows.push([img, textChildren]);
  }

  // Compose the table
  const cells = [
    ['Cards (cards25)'],
    ...rows
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
