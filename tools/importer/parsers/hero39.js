/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero39)'];

  // Get background image from the inline style attribute
  let bgUrl = '';
  const style = element.getAttribute('style');
  if (style) {
    const match = style.match(/background:\s*url\(['"]?([^'")]+)['"]?/i);
    if (match && match[1]) {
      bgUrl = match[1];
    }
  }

  // Create image element for the background
  let imageEl = '';
  if (bgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgUrl;
    imageEl.alt = '';
  }
  const bgRow = [imageEl];

  // Extract content: The .home-banner__desc element contains the text content
  let contentRowContent = '';
  const desc = element.querySelector('.home-banner__desc');
  if (desc) {
    // Reference existing element directly
    // Optionally: In real use, one might want to upgrade this to an <h1> or <p>,
    // but to keep semantic meaning from source and resilience, we just reference it
    contentRowContent = desc;
  }
  const contentRow = [contentRowContent];

  // Build the table per requirements
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
