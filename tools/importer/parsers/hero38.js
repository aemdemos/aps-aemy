/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero38)'];

  // 2. Get background image from style
  let bgImageUrl = '';
  const style = element.getAttribute('style') || '';
  const urlMatch = style.match(/background:\s*url\('(.*?)'/);
  if (urlMatch && urlMatch[1]) {
    bgImageUrl = urlMatch[1];
  }
  let imageEl = null;
  if (bgImageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgImageUrl;
    imageEl.alt = '';
  }

  // 3. Content - headline and CTA if present
  const contentEls = [];
  // Get the description text
  const descWrapper = element.querySelector('.home-banner__desc-wrapper');
  if (descWrapper) {
    const desc = descWrapper.querySelector('.home-banner__desc');
    if (desc && desc.textContent.trim()) {
      // Use a heading for semantic meaning
      const heading = document.createElement('h2');
      heading.textContent = desc.textContent.trim();
      contentEls.push(heading);
    }
  }
  // Add CTA if element is a link itself and has an href
  if (element.href) {
    // Only add the link if there's non-empty text content
    let ctaText = '';
    // If there is a description, use that as CTA text
    if (descWrapper && descWrapper.textContent.trim()) {
      ctaText = descWrapper.textContent.trim();
    } else {
      ctaText = 'Learn more';
    }
    // Only add a CTA button if not duplicate (if the heading is the same text, skip it)
    if (!contentEls.some(e => e.textContent && e.textContent.trim() === ctaText)) {
      const link = document.createElement('a');
      link.href = element.href;
      link.textContent = ctaText;
      contentEls.push(link);
    }
  }

  // Build the table structure per block guidelines
  const cells = [
    headerRow,
    [imageEl],
    [contentEls]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
