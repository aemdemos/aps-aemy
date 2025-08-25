/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image from style attribute
  const style = element.getAttribute('style') || '';
  let imageUrl = '';
  const bgMatch = style.match(/background:\s*url\('([^']+)'\)/);
  if (bgMatch) {
    imageUrl = bgMatch[1];
  }

  // Create img element if image url is present
  let imageEl = null;
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    // Optional: add alt text if available (none in HTML)
  }

  // Get the text content from the banner description
  let bannerText = '';
  let bannerDescEl = null;
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');
  if (descWrapper) {
    bannerDescEl = descWrapper.querySelector('.home-banner__desc');
    if (bannerDescEl) {
      bannerText = bannerDescEl.textContent.trim();
    }
  }

  // Compose content cell for row 3
  // Use an h2 for emphasis (no hierarchical headings in source)
  let textEl = null;
  if (bannerText) {
    textEl = document.createElement('h2');
    textEl.textContent = bannerText;
  }

  // Compose final cells structure
  const cells = [
    ['Hero (hero38)'],
    [imageEl ? imageEl : ''],
    [textEl ? textEl : '']
  ];

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
