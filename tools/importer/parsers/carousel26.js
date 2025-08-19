/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: one cell with block name
  const cells = [['Carousel']];

  // 2. Find main slick-track with slides
  const track = element.querySelector('.slick-track');
  if (!track) return;

  // 3. Get only non-cloned slides
  const slides = Array.from(track.children).filter(slide =>
    slide.classList.contains('slick-slide') &&
    !slide.classList.contains('slick-cloned') &&
    Number(slide.getAttribute('data-slick-index')) >= 0
  );

  // 4. Map image src to modal title and ALL <p> elements from modal-footer
  const modalInfo = {};
  const modals = element.querySelectorAll('div[id^="sliderImgModal-"]');
  modals.forEach(modal => {
    const img = modal.querySelector('img');
    const h5 = modal.querySelector('h5');
    // Get all <p> tags inside .modal-footer
    const descPs = Array.from(modal.querySelectorAll('.modal-footer p'));
    if (img && img.src) {
      modalInfo[img.src] = {
        title: h5 ? h5.textContent.trim() : '',
        descPs: descPs // preserve paragraph elements even if empty
      };
    }
  });

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img) return;
    let title = '', descPs = [];
    if (modalInfo[img.src]) {
      title = modalInfo[img.src].title;
      descPs = modalInfo[img.src].descPs;
    } else if (img.alt) {
      title = img.alt;
    }
    // Build text cell: heading then all description paragraphs
    const textCell = [];
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title;
      textCell.push(h2);
    }
    descPs.forEach(p => textCell.push(p));
    cells.push([
      img,
      textCell.length ? textCell : ''
    ]);
  });

  // 5. Create and replace with the Carousel block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
