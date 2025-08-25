/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const rows = [['Carousel']];

  // Build a map of img src to all associated modal content (title + modal-body + modal-footer except image)
  const modalContentMap = {};
  Array.from(element.querySelectorAll('div[id^="sliderImgModal-"]')).forEach(modalDiv => {
    const img = modalDiv.querySelector('img');
    const textParts = [];

    // Add modal-title as h2
    const title = modalDiv.querySelector('.modal-title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textParts.push(h2);
    }

    // Add all non-img elements from modal-body
    const modalBody = modalDiv.querySelector('.modal-body');
    if (modalBody) {
      Array.from(modalBody.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.tagName.toLowerCase() !== 'img') {
          textParts.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textParts.push(p);
        }
      });
    }

    // Add all elements from modal-footer (commonly p tags)
    const modalFooter = modalDiv.querySelector('.modal-footer');
    if (modalFooter) {
      Array.from(modalFooter.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          textParts.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textParts.push(p);
        }
      });
    }

    modalContentMap[img && img.src] = textParts;
  });

  // Get all unique slides (non-cloned)
  const slides = Array.from(element.querySelectorAll('.slick-slide'))
    .filter(slide => !slide.classList.contains('slick-cloned'));
  const seen = new Set();
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img || !img.src || seen.has(img.src)) return;
    seen.add(img.src);
    // First cell: image element
    const imgElem = img;
    // Second cell: all modal text parts (title + descriptions + footer)
    const modalCell = modalContentMap[img.src];
    let textCell = '';
    if (modalCell && modalCell.length > 0) {
      textCell = modalCell;
    } else if (img.alt && img.alt.trim()) {
      // fallback: use alt as heading
      const h2 = document.createElement('h2');
      h2.textContent = img.alt.trim();
      textCell = h2;
    }
    rows.push([imgElem, textCell]);
  });

  // Fallback: all unique images if no non-cloned slides
  if (rows.length === 1) {
    Array.from(element.querySelectorAll('.slick-slide img')).forEach(img => {
      if (!img.src || seen.has(img.src)) return;
      seen.add(img.src);
      const imgElem = img;
      const modalCell = modalContentMap[img.src];
      let textCell = '';
      if (modalCell && modalCell.length > 0) {
        textCell = modalCell;
      } else if (img.alt && img.alt.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = img.alt.trim();
        textCell = h2;
      }
      rows.push([imgElem, textCell]);
    });
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
