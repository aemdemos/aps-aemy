/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract background image URL from inline style
  let bgUrl = '';
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background:\s*url\(['"]?([^'")]+)['"]?/i);
  if (bgMatch && bgMatch[1]) {
    bgUrl = bgMatch[1];
  }

  // 2. Reference the background image as an <img>, if present
  let bgImg = null;
  if (bgUrl) {
    bgImg = document.createElement('img');
    bgImg.src = bgUrl;
  }

  // 3. Extract text banner content
  let descWrapper = element.querySelector('.home-banner__desc-wrapper');
  let bannerContent = [];
  if (descWrapper) {
    // Reference the whole desc wrapper (which contains all text)
    bannerContent.push(descWrapper);
  }

  // 4. Compose table rows according to the Hero block spec (header, image, content)
  const rows = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [bannerContent.length ? bannerContent : '']
  ];

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
