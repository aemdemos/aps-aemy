/* global WebImporter */
export default function parse(element, { document }) {
  // Build block table: header row is a single cell ['Carousel']
  const cells = [['Carousel']];

  // Get slide elements (non-cloned)
  const track = element.querySelector('.slick-track');
  if (!track) return;
  const slides = Array.from(track.children).filter(slide => !slide.classList.contains('slick-cloned'));

  // Build a map from image src to its modal for extracting text content
  const modalMap = {};
  Array.from(element.querySelectorAll('[id^="sliderImgModal-"]')).forEach(modal => {
    const img = modal.querySelector('.modal-body img');
    if (img && img.src) {
      modalMap[img.src] = modal;
    }
  });

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    let textCell = '';
    if (img && modalMap[img.src]) {
      const modal = modalMap[img.src];
      const textContent = [];
      // Title as heading
      const title = modal.querySelector('.modal-title');
      if (title && title.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent.trim();
        textContent.push(h2);
      }
      // Extract description/additional content from modal-body (text nodes and non-img elements)
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        Array.from(modalBody.childNodes).forEach(node => {
          if (node.nodeType === 3 && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textContent.push(p);
          } else if (node.nodeType === 1 && node.tagName !== 'IMG') {
            textContent.push(node);
          }
        });
      }
      // Call-to-action or additional content from modal-footer
      const footerP = modal.querySelector('.modal-footer p');
      if (footerP && footerP.textContent.trim()) {
        textContent.push(footerP);
      }
      // Only set text cell if any content is present
      if (textContent.length > 0) {
        textCell = textContent;
      }
    }
    cells.push([img || '', textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
