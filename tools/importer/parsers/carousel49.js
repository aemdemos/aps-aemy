/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Carousel (carousel49)'];

  // Locate the slides container
  const slidesContainer = element.querySelector('.glide__track > ul.glide__slides');
  if (!slidesContainer) return;

  // Only use slides that are not clones
  let slides = Array.from(slidesContainer.children).filter(
    (li) => li.classList.contains('glide__slide') && !li.classList.contains('glide__slide--clone')
  );
  if (slides.length === 0) {
    // fallback: use all .glide__slide
    slides = Array.from(slidesContainer.children).filter(
      (li) => li.classList.contains('glide__slide')
    );
  }

  const rows = [headerRow];

  slides.forEach((slide) => {
    // 1st cell: image (first <img> found in the slide)
    const img = slide.querySelector('img');

    // 2nd cell: text content
    // Try to get .slide-content (for robustness)
    let textCellContent = '';
    const contentDiv = slide.querySelector('.slide-content');
    if (contentDiv) {
      // Collect all child nodes (preserving HTML structure, referencing original nodes)
      const cellNodes = [];
      // Title
      const title = contentDiv.querySelector('h3, .slide-content__title');
      if (title) {
        // Use heading as h2 (semantic)
        const heading = document.createElement('h2');
        heading.innerHTML = title.innerHTML;
        cellNodes.push(heading);
      }
      // Description(s)
      const descs = contentDiv.querySelectorAll('p, .slide-content__desc');
      descs.forEach((desc) => {
        // Only add each <p> once
        if (!cellNodes.includes(desc)) {
          cellNodes.push(desc);
        }
      });
      // CTA(s)
      const ctas = contentDiv.querySelectorAll('a');
      ctas.forEach((cta) => {
        // Only add <a> if not already included
        if (!cellNodes.includes(cta)) {
          cellNodes.push(cta);
        }
      });
      // Join all content, or use empty string if nothing collected
      textCellContent = cellNodes.length ? cellNodes : '';
    } else {
      // fallback: try all text and links except for the image/link
      const cellNodes = [];
      // Try all p, a, h2/h3, etc except the image's parent link
      const wrapper = slide.querySelector('.slide-wrapper') || slide;
      // Remove the image link from consideration
      let imageLink = null;
      if (img) {
        imageLink = img.closest('a');
      }
      Array.from(wrapper.children).forEach((child) => {
        if (child === imageLink) return;
        if (child.tagName === 'DIV' || child.tagName === 'SECTION') {
          Array.from(child.childNodes).forEach((n) => {
            if (n.nodeType === 1 /* element */ || (n.nodeType === 3 && n.textContent.trim())) {
              cellNodes.push(n);
            }
          });
        } else if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
          cellNodes.push(child);
        }
      });
      textCellContent = cellNodes.length ? cellNodes : '';
    }

    rows.push([img, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
