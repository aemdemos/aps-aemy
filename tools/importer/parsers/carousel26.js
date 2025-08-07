/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main slick-track containing slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Get the real slides (not slick-cloned, index >= 0)
  const slides = Array.from(slickTrack.children).filter(slide => {
    const idx = slide.getAttribute('data-slick-index');
    return idx !== null && Number(idx) >= 0 && !slide.classList.contains('slick-cloned');
  });

  // Build a map from image src to modal info (h5 for title)
  const modalInfo = {};
  Array.from(element.querySelectorAll('div[id^="sliderImgModal-"]')).forEach(modal => {
    const img = modal.querySelector('img');
    const h5 = modal.querySelector('h5');
    if (img && h5) {
      modalInfo[img.getAttribute('src')] = { title: h5.textContent };
    }
  });

  // Table header: single cell only
  const cells = [['Carousel']];

  // Add each slide: [img, text] (2 columns in content rows)
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img) return;
    const imgSrc = img.getAttribute('src');
    let textElems = [];
    const info = modalInfo[imgSrc];
    if (info && info.title) {
      const h2 = document.createElement('h2');
      h2.textContent = info.title;
      textElems.push(h2);
    }
    if (textElems.length === 0) textElems = '';
    // Add as one array of two elements (2 columns), preserving the header row as 1 column
    cells.push([img, textElems]);
  });

  // WebImporter.DOMUtils.createTable expects only the first row (header) can have a different number of columns
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
