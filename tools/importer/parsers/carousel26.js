/* global WebImporter */
export default function parse(element, { document }) {
  // Modal mapping by image src
  const modalMap = {};
  const modals = element.querySelectorAll('.modal');
  modals.forEach(modal => {
    const img = modal.querySelector('img');
    if (img && img.src) {
      modalMap[img.src] = modal;
    }
  });

  // Find original (not cloned) slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  const slides = Array.from(slickTrack.children).filter(slide => {
    const idx = parseInt(slide.getAttribute('data-slick-index'), 10);
    return !isNaN(idx) && idx >= 0;
  });

  // Track seen images to avoid duplicates
  const usedSrcs = new Set();
  const rows = [];

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img || !img.src || usedSrcs.has(img.src)) return;
    usedSrcs.add(img.src);
    const imgEl = img;
    // Second cell: all text content from modal
    let cellContent = [];
    const modal = modalMap[img.src];
    if (modal) {
      // Title
      const h5 = modal.querySelector('.modal-title');
      if (h5 && h5.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = h5.textContent.trim();
        cellContent.push(h2);
      }
      // Modal body: non-img text nodes/elements
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        Array.from(modalBody.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            cellContent.push(p);
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'IMG' && node.textContent.trim()) {
            cellContent.push(node);
          }
        });
      }
      // Modal footer: any paragraphs or text nodes
      const modalFooter = modal.querySelector('.modal-footer');
      if (modalFooter) {
        Array.from(modalFooter.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            cellContent.push(p);
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.textContent.trim()) {
            cellContent.push(node);
          }
        });
      }
    }
    // If no content, use empty string for second cell
    const contentCell = cellContent.length > 0 ? cellContent : '';
    rows.push([imgEl, contentCell]);
  });

  // Create header row: single column, matches example
  const cells = [['Carousel'], ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
