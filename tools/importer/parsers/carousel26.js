/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the modal for a given img src
  function getModalForImg(src) {
    const modals = Array.from(element.querySelectorAll('div[id^="sliderImgModal-"]'));
    for (const modal of modals) {
      const img = modal.querySelector('img');
      if (img && img.src === src) {
        return modal;
      }
    }
    return null;
  }

  // Find the .slick-track (contains all slides)
  const track = element.querySelector('.slick-track');
  if (!track) return;
  // Only include non-cloned slides (data-slick-index >= 0 and no 'slick-cloned' class)
  const slides = Array.from(track.children).filter(slide => {
    return !slide.classList.contains('slick-cloned') && parseInt(slide.getAttribute('data-slick-index'), 10) >= 0;
  });

  // Build table rows: header as a single column (will span both visually)
  const rows = [['Carousel']];

  slides.forEach(slide => {
    // The image
    const img = slide.querySelector('img');
    let imageCell = '';
    let textCellContent = [];
    if (img) {
      imageCell = img;
      // Try to find corresponding modal for this image, for heading/text/cta
      const modal = getModalForImg(img.src);
      if (modal) {
        // 1. Add the heading from modal title (if present) as h2
        const h5 = modal.querySelector('.modal-title, h5');
        if (h5 && h5.textContent.trim()) {
          const h2 = document.createElement('h2');
          h2.textContent = h5.textContent.trim();
          textCellContent.push(h2);
        }
        // 2. Add any non-image children of modal-body (text, etc.)
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          Array.from(modalBody.childNodes).forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
              textCellContent.push(document.createTextNode(node.textContent));
            } else if (node.nodeType === 1 && node.tagName !== 'IMG' && node.textContent.trim()) {
              textCellContent.push(node);
            }
          });
        }
        // 3. Add any text or link in modal-footer
        const modalFooter = modal.querySelector('.modal-footer');
        if (modalFooter) {
          Array.from(modalFooter.childNodes).forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
              textCellContent.push(document.createTextNode(node.textContent));
            } else if (node.nodeType === 1 && node.textContent.trim()) {
              textCellContent.push(node);
            }
          });
        }
      }
      // If no text found in modal, fallback to image alt text
      if (textCellContent.length === 0 && img.alt && img.alt.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = img.alt.trim();
        textCellContent.push(h2);
      }
    }
    // Guarantee two columns per row for the block structure
    rows.push([imageCell, textCellContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
