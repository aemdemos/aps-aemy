/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name exactly as specified
  const headerRow = ['Hero (hero39)'];

  // 2. Extract background image URL from the style attribute
  let bgUrl = '';
  const styleAttr = element.getAttribute('style') || '';
  const bgMatch = styleAttr.match(/background:\s*url\(['"]?([^'")]+)['"]?\)/);
  if (bgMatch && bgMatch[1]) {
    bgUrl = bgMatch[1];
  }

  // 3. Create an <img> element for the background if present
  let bgImg = '';
  if (bgUrl) {
    bgImg = document.createElement('img');
    bgImg.src = bgUrl;
    // Optionally, set alt to empty since we don't have actual alt text
    bgImg.alt = '';
  }

  // 4. Extract the description content, reference the existing DOM node
  let contentElem = '';
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');
  if (descWrapper) {
    // Reference the wrapper and its content as the content block, as per guidelines
    contentElem = descWrapper;
  }

  // 5. Construct the block table
  const cells = [
    headerRow,
    [bgImg || ''],
    [contentElem || '']
  ];

  // 6. Replace the element with the new table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
