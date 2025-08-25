/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Find all unique slides (ignore clones, only take first instance of each image)
  const slideList = element.querySelectorAll('.glide__slide, .glide__slide--active');
  const seenImages = new Set();
  slideList.forEach((slide) => {
    const wrapper = slide.querySelector('.slide-wrapper');
    if (!wrapper) return;
    // Image column
    const imgLink = wrapper.querySelector('img');
    if (!imgLink || seenImages.has(imgLink.src)) return;
    seenImages.add(imgLink.src);
    // Text content column
    const contentDiv = wrapper.querySelector('.slide-content');
    if (!contentDiv) return;
    const cellContent = [];
    // Title as strong
    const title = contentDiv.querySelector('.slide-content__title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      cellContent.push(strong);
      cellContent.push(document.createElement('br'));
    }
    // Description
    const desc = contentDiv.querySelector('.slide-content__desc');
    if (desc && desc.textContent.trim()) {
      // Reference original element for resilience
      cellContent.push(desc);
      cellContent.push(document.createElement('br'));
    }
    // CTA link
    const link = contentDiv.querySelector('.slide-content__link');
    if (link && link.textContent.trim()) {
      cellContent.push(link);
    }
    // Remove trailing <br> if present
    while (cellContent.length && cellContent[cellContent.length - 1].tagName === 'BR') {
      cellContent.pop();
    }
    rows.push([imgLink, cellContent]);
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
