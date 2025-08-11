/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero38)'];

  // Row 2: Background image (from style attribute)
  let imageCell = '';
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background(?:-image)?:[^;]*url\(['"]?([^'")]+)['"]?\)/i);
  if (bgMatch && bgMatch[1]) {
    const img = document.createElement('img');
    img.src = bgMatch[1];
    img.alt = '';
    imageCell = img;
  }

  // Row 3: Content (headline, subheading, CTA)
  // In this example, there is only a paragraph of text, no heading or button
  // The full text is inside .home-banner__desc
  let contentCell = '';
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');
  if (descWrapper) {
    // Instead of cloning or creating new elements, reference the existing structure
    // However, since the description is just a div, we can use it directly
    const desc = descWrapper.querySelector('.home-banner__desc');
    if (desc) {
      contentCell = desc;
    }
  }

  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
