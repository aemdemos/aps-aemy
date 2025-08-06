/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get unique slides by image src
  function getUniqueSlides(slideElements) {
    const seen = new Set();
    const unique = [];
    slideElements.forEach((slide) => {
      const img = slide.querySelector('img');
      if (img && !seen.has(img.src)) {
        seen.add(img.src);
        unique.push(slide);
      }
    });
    return unique;
  }

  // Find slick slides (not .slick-cloned)
  let slideDivs = [];
  const track = element.querySelector('.slick-track');
  if (track) {
    slideDivs = Array.from(track.children).filter(div => div.classList.contains('slick-slide') && !div.classList.contains('slick-cloned'));
  }
  if (slideDivs.length === 0) {
    slideDivs = Array.from(element.querySelectorAll('.slick-slide')).filter(div => !div.classList.contains('slick-cloned'));
  }

  const uniqueSlides = getUniqueSlides(slideDivs);

  const rows = [['Carousel']];

  uniqueSlides.forEach((slide) => {
    // First cell: the image element (reference only)
    const img = slide.querySelector('img');
    let imgCell = '';
    if (img) imgCell = img;

    // Second cell: try to find all relevant text content for the slide
    let textContent = [];
    const anchor = slide.querySelector('a[data-target]');
    if (anchor && anchor.getAttribute('data-target')) {
      let modalId = anchor.getAttribute('data-target');
      if (modalId.startsWith('#')) modalId = modalId.substring(1);
      const modal = document.getElementById(modalId);
      if (modal) {
        // Modal title (h5)
        const h5 = modal.querySelector('.modal-title');
        if (h5 && h5.textContent.trim()) {
          const h2 = document.createElement('h2');
          h2.textContent = h5.textContent.trim();
          textContent.push(h2);
        }
        // Modal body paragraphs/text except the image
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          Array.from(modalBody.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const p = document.createElement('p');
              p.textContent = node.textContent.trim();
              textContent.push(p);
            }
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'img') {
              // Only push if it contains text
              if(node.textContent.trim()) textContent.push(node);
            }
          });
        }
        // Modal footer p or plain text
        const modalFooter = modal.querySelector('.modal-footer');
        if (modalFooter) {
          Array.from(modalFooter.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const p = document.createElement('p');
              p.textContent = node.textContent.trim();
              textContent.push(p);
            }
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'p' && node.textContent.trim()) {
              textContent.push(node);
            }
          });
        }
      }
    }
    // Fallback: use image alt as heading if no modal and not already present
    if (textContent.length === 0 && img && img.alt && img.alt.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = img.alt.trim();
      textContent.push(h2);
    }
    // Compose row: If no text, use empty string for cell
    rows.push([imgCell, textContent.length === 1 ? textContent[0] : (textContent.length > 1 ? textContent : '')]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
