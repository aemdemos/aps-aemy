/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Hero (hero38)'];

  // --- Row 2: Background image ---
  // Extract background image URL from style attribute
  let bgImgUrl = null;
  const style = element.getAttribute('style') || '';
  const urlMatch = style.match(/url\(['"]?([^'")]+)['"]?\)/i);
  if (urlMatch) {
    bgImgUrl = urlMatch[1];
  }

  // If present, create a single <img> element (do not clone, create new)
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // --- Row 3: Text content and CTA ---
  // Try to find the main text
  let contentCellNodes = [];
  const desc = element.querySelector('.home-banner__desc');
  // Use the descriptive div if present, otherwise fallback to the element's text, trimmed
  let textContent = '';
  if (desc) {
    textContent = desc.textContent.trim();
  } else {
    textContent = element.textContent.trim();
  }
  // Is there a link (CTA)? The entire banner is a link
  if (element.href && textContent) {
    // Create a single <a> element, referencing the source element
    const ctaLink = document.createElement('a');
    ctaLink.href = element.href;
    ctaLink.textContent = textContent;
    contentCellNodes.push(ctaLink);
  } else if (textContent) {
    // If there's only text, output as plain text
    contentCellNodes.push(textContent);
  }

  // Build the table rows, as per the block spec: 1 column, 3 rows
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentCellNodes.length > 0 ? contentCellNodes : '']
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}