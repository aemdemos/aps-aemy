/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const rows = [['Carousel']];

  // Locate the slick-track containing the slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Get all unique slides (not .slick-cloned)
  let slides = Array.from(slickTrack.children).filter(slide => {
    const idx = parseInt(slide.getAttribute('data-slick-index'), 10);
    return !slide.classList.contains('slick-cloned') && idx >= 0;
  });
  if (slides.length === 0) {
    slides = Array.from(slickTrack.children).filter(slide => {
      const idx = parseInt(slide.getAttribute('data-slick-index'), 10);
      return idx >= 0;
    }).slice(0, 5);
  }

  // Build a map: image src -> { title, description } from modals
  const modalMeta = {};
  element.querySelectorAll('[id^="sliderImgModal-"]').forEach(modal => {
    const img = modal.querySelector('img');
    const titleEl = modal.querySelector('.modal-title');
    // Find description/caption in modal-footer <p>
    let descText = '';
    const footerP = modal.querySelector('.modal-footer p');
    if (footerP && footerP.textContent.trim()) {
      descText = footerP.textContent.trim();
    }
    if (img) {
      modalMeta[img.src] = {
        title: titleEl ? titleEl.textContent.trim() : '',
        description: descText
      };
    }
  });

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img) return;
    const imgSrc = img.src;
    const meta = modalMeta[imgSrc] || {};
    const textEls = [];
    // Add title if present
    if (meta.title) {
      const h3 = document.createElement('h3');
      h3.textContent = meta.title;
      textEls.push(h3);
    } else if (img.alt && img.alt.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = img.alt.trim();
      textEls.push(h3);
    }
    // Add description/caption if present
    if (meta.description) {
      const p = document.createElement('p');
      p.textContent = meta.description;
      textEls.push(p);
    }
    rows.push([
      img,
      textEls.length ? textEls : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
