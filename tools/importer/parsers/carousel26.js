/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as in the example
  const cells = [['Carousel']];

  // Get the slick-track containing the slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Only non-cloned slides with an image (true slides)
  const slides = Array.from(slickTrack.children).filter(slide =>
    slide.classList.contains('slick-slide') &&
    !slide.classList.contains('slick-cloned') &&
    slide.querySelector('img')
  );

  slides.forEach(slide => {
    // 1st cell: the image element, referenced directly
    const img = slide.querySelector('img');

    // 2nd cell: try to get modal title and any additional modal content as text
    let textCellContent = [];
    const anchor = slide.querySelector('a[data-target]');
    if (anchor) {
      const modalId = anchor.getAttribute('data-target');
      if (modalId && modalId.startsWith('#')) {
        const modal = document.querySelector(modalId);
        if (modal) {
          // Title as heading
          const modalTitle = modal.querySelector('.modal-title');
          if (modalTitle && modalTitle.textContent.trim()) {
            const heading = document.createElement('h2');
            heading.textContent = modalTitle.textContent.trim();
            textCellContent.push(heading);
          }
          // Look for any <p> (or other block) with visible text in modal body or footer
          // Add all meaningful content
          ['.modal-body', '.modal-footer'].forEach(sel => {
            const contentBlock = modal.querySelector(sel);
            if (contentBlock) {
              Array.from(contentBlock.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                  const para = document.createElement('p');
                  para.textContent = node.textContent.trim();
                  textCellContent.push(para);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                  // Only include elements with text
                  if (node.textContent && node.textContent.trim()) {
                    textCellContent.push(node);
                  }
                }
              });
            }
          });
        }
      }
    }
    // Fallback: use image alt as heading if no modal or no text
    if (textCellContent.length === 0 && img && img.alt && img.alt.trim()) {
      const heading = document.createElement('h2');
      heading.textContent = img.alt.trim();
      textCellContent.push(heading);
    }
    // If there's still no text (no alt), keep cell empty string
    cells.push([img, textCellContent.length > 0 ? textCellContent : '']);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
