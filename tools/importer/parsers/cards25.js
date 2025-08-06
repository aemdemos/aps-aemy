/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slides container
  const track = element.querySelector('.glide__track');
  if (!track) return;
  const slidesList = track.querySelector('.glide__slides');
  if (!slidesList) return;

  // Only get slides that are not clones
  const slides = Array.from(slidesList.children).filter(slide =>
    slide.classList.contains('glide__slide') && !slide.classList.contains('glide__slide--clone')
  );
  if (slides.length === 0) return;

  // Prepare table rows
  const rows = [['Cards (cards25)']];

  // For each slide, extract the image and the card text content as a single block of elements
  slides.forEach(slide => {
    let img = slide.querySelector('img');
    // Find the card text container
    let textBlock = null;
    const contentDiv = slide.querySelector('.slide-content');
    if (contentDiv) {
      // Create a container for all content so we preserve structure and do not miss text
      textBlock = document.createElement('div');
      // Preserve order and structure of children
      Array.from(contentDiv.childNodes).forEach(child => {
        // Only include elements or text nodes with content
        if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
          textBlock.appendChild(child);
        }
      });
    } else {
      // Fallback: collect all text nodes and elements except the image
      textBlock = document.createElement('div');
      Array.from(slide.childNodes).forEach(child => {
        if (child !== img && ((child.nodeType === Node.ELEMENT_NODE && child.textContent.trim()) || (child.nodeType === Node.TEXT_NODE && child.textContent.trim()))) {
          textBlock.appendChild(child);
        }
      });
    }
    rows.push([img, textBlock]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
