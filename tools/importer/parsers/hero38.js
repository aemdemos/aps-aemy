/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block
  const headerRow = ['Hero (hero38)'];

  // 2. Extract the background image from inline style
  let bgImgElem = null;
  const style = element.getAttribute('style') || '';
  // Match url('...') in background property
  const bgMatch = style.match(/background\s*:\s*url\(['"]?([^'")]+)['"]?/i);
  if (bgMatch && bgMatch[1]) {
    const src = bgMatch[1];
    bgImgElem = document.createElement('img');
    bgImgElem.src = src;
    bgImgElem.alt = '';
  }

  // 3. Extract the content cell: use the .home-banner__desc-wrapper
  // Retain reference to the existing element from document
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');

  // 4. Prepare the table cells according to the block format: 1 column, 3 rows
  const cells = [
    headerRow,
    [bgImgElem || ''],
    [descWrapper || '']
  ];

  // 5. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
