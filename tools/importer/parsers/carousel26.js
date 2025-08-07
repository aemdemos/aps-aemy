/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the rows array for the table
  const rows = [];
  // Header row as required
  rows.push(['Carousel']);

  // Find the slides container
  const track = element.querySelector('.slick-track');
  if (!track) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
    return;
  }

  // Only non-cloned slides
  const slides = Array.from(track.children).filter(
    (slide) => slide.classList.contains('slick-slide') && !slide.classList.contains('slick-cloned')
  );

  // For each slide, extract image and associated text
  slides.forEach((slide) => {
    // Image cell
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // Text cell: title and any extra content from modal (footer, etc)
    let textCell = '';
    if (img && img.src) {
      // Find corresponding modal
      const modals = document.querySelectorAll('div[id^="sliderImgModal-"]');
      let foundModal = null;
      for (const modal of modals) {
        const modalImg = modal.querySelector('.modal-body img');
        if (modalImg && modalImg.src === img.src) {
          foundModal = modal;
          break;
        }
      }
      const textContents = [];
      if (foundModal) {
        // Title from modal
        const modalTitle = foundModal.querySelector('.modal-title');
        if (modalTitle && modalTitle.textContent.trim()) {
          const h2 = document.createElement('h2');
          h2.textContent = modalTitle.textContent.trim();
          textContents.push(h2);
        }
        // Modal footer and body text (description/additional)
        // Collect any non-empty paragraphs from modal-footer
        const modalFooters = foundModal.querySelectorAll('.modal-footer p');
        modalFooters.forEach((p) => {
          if (p.textContent && p.textContent.trim()) {
            const para = document.createElement('p');
            para.textContent = p.textContent.trim();
            textContents.push(para);
          }
        });
        // Also include any additional paragraphs in the modal-body (not image)
        const modalBody = foundModal.querySelector('.modal-body');
        if (modalBody) {
          Array.from(modalBody.children).forEach((child) => {
            if (child.tagName === 'P' && child.textContent.trim()) {
              const para = document.createElement('p');
              para.textContent = child.textContent.trim();
              textContents.push(para);
            }
          });
        }
      } else if (img.alt && img.alt.trim()) {
        // Fall back to image alt as heading
        const h2 = document.createElement('h2');
        h2.textContent = img.alt.trim();
        textContents.push(h2);
      }
      if (textContents.length > 1) {
        textCell = textContents;
      } else if (textContents.length === 1) {
        textCell = textContents[0];
      }
    }
    rows.push([imageCell, textCell]);
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
