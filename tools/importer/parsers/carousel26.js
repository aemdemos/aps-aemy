/* global WebImporter */
export default function parse(element, { document }) {
  // Find all non-cloned slides (data-slick-index >= 0)
  const slides = Array.from(element.querySelectorAll('.slick-track > .slick-slide'))
    .filter(slide => {
      const idx = Number(slide.getAttribute('data-slick-index'));
      return !isNaN(idx) && idx >= 0;
    });

  const seenSrcs = new Set();
  const rows = [['Carousel']]; // Header row, exactly as specified

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img || !img.src || seenSrcs.has(img.src)) return;
    seenSrcs.add(img.src);
    // First cell: reference existing img element
    const imageCell = img;

    // Second cell: collect as much text content as available from the modal
    let cellContent = [];
    let a = img.closest('a');
    let modalId = '';
    if (a && a.getAttribute('href')) {
      const m = a.getAttribute('href').match(/#sliderImgModal-(\d+)/);
      if (m && m[1]) {
        modalId = 'sliderImgModal-' + m[1];
      }
    }
    let modalTitle = '';
    let modalDescription = '';
    let modalCTA = null;
    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        // Title
        const titleEl = modal.querySelector('.modal-title');
        if (titleEl && titleEl.textContent.trim()) {
          modalTitle = titleEl.textContent.trim();
        }
        // Description: modal-footer p
        const descEl = modal.querySelector('.modal-footer p');
        if (descEl && descEl.textContent.trim()) {
          modalDescription = descEl.textContent.trim();
        } else {
          // fallback: any text node in modal-body not inside image
          const body = modal.querySelector('.modal-body');
          if (body) {
            Array.from(body.childNodes).forEach(child => {
              if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                modalDescription = child.textContent.trim();
              }
            });
          }
        }
        // CTA: look for links in modal-footer p
        if (descEl) {
          const link = descEl.querySelector('a');
          if (link && link.href && link.textContent.trim()) {
            modalCTA = link;
          }
        }
      }
    }
    // Fallback for missing title
    if (!modalTitle && img.alt) {
      modalTitle = img.alt;
    }
    // Heading
    if (modalTitle) {
      const h2 = document.createElement('h2');
      h2.textContent = modalTitle;
      cellContent.push(h2);
    }
    // Description
    if (modalDescription) {
      const p = document.createElement('p');
      p.textContent = modalDescription;
      cellContent.push(p);
    }
    // CTA link (if found)
    if (modalCTA) {
      cellContent.push(modalCTA);
    }
    // Always provide an array, even if empty
    rows.push([imageCell, cellContent.length ? cellContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
