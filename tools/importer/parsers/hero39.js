/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Hero (hero39)'];

  // Extract background image URL from the element's style
  let bgImgUrl = '';
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background:\s*url\(['"]?([^'"]+)['"]?/i);
  if (bgMatch && bgMatch[1]) {
    bgImgUrl = bgMatch[1];
  }

  // Create <img> element for background image if present
  let bgImg = null;
  if (bgImgUrl) {
    bgImg = document.createElement('img');
    bgImg.src = bgImgUrl;
    bgImg.alt = '';
  }

  // For the content row, reference the banner description wrapper, including all its content
  // This ensures all text (including any CTA/links or future subheadings) gets included
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');
  let contentCell = null;
  if (descWrapper) {
    // Reference the actual DOM element (do not clone)
    contentCell = descWrapper;
  } else {
    // Fallback: reference the element itself (should rarely happen)
    contentCell = element;
  }

  const rows = [
    headerRow,
    [bgImg],
    [contentCell]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
