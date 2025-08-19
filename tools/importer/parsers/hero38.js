/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Hero (hero38)'];

  // --- Background image extraction ---
  // Look for background url in the style attribute
  let bgUrl = '';
  const style = element.getAttribute('style');
  if (style) {
    const bgMatch = style.match(/background\s*:\s*url\(['"]?([^'")]+)['"]?/);
    if (bgMatch && bgMatch[1]) {
      bgUrl = bgMatch[1];
    }
  }

  let imageEl = '';
  if (bgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgUrl;
    imageEl.alt = '';
    imageEl.loading = 'lazy';
  }
  
  // --- Content extraction ---
  // Find the main description content inside the banner
  let contentCell = '';
  // The description is inside .home-banner__desc-wrapper > .home-banner__desc
  // Use its direct children if any, or itself if only text
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');
  if (descWrapper) {
    // Gather all children of descWrapper (could be just 1 div, or more)
    const nodes = Array.from(descWrapper.childNodes);
    if (nodes.length === 1 && nodes[0].nodeType === Node.ELEMENT_NODE) {
      // If it's just one element, use it directly
      contentCell = nodes[0];
    } else if (nodes.length > 0) {
      contentCell = nodes;
    }
  }

  // Compose the table structure: 1 column, 3 rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell ? contentCell : '']
  ];
  
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
