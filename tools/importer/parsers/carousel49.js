/* global WebImporter */
export default function parse(element, { document }) {
  // Get carousel slides (ignore clones)
  const glideTrack = element.querySelector('.glide__track');
  if (!glideTrack) return;
  const slideList = glideTrack.querySelector('ul.glide__slides');
  if (!slideList) return;

  const slides = Array.from(slideList.children).filter(
    (li) => li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone')
  );

  // Table header
  const rows = [['Carousel']];

  slides.forEach((slide) => {
    // Reference the first <img> in the slide
    const wrapper = slide.querySelector('.slide-wrapper');
    if (!wrapper) return;
    const img = wrapper.querySelector('img');

    // Prepare text cell: collect all children of .slide-content, preserve tags
    const slideContent = wrapper.querySelector('.slide-content');
    let textColContent = [];
    if (slideContent) {
      Array.from(slideContent.children).forEach((child) => {
        if (/^h[1-6]$/i.test(child.tagName)) {
          // Convert heading to h2
          const h2 = document.createElement('h2');
          h2.innerHTML = child.innerHTML;
          textColContent.push(h2);
        } else {
          textColContent.push(child);
        }
      });
    }
    if (img) {
      rows.push([
        img,
        textColContent.length > 0 ? textColContent : ''
      ]);
    }
  });

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
