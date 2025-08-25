/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block name header row
  const headerRow = ['Hero (hero38)'];

  // 2. Background image row: extract from style
  let bgUrl = '';
  const style = element.getAttribute('style') || '';
  const match = style.match(/background\s*:\s*url\(['"]?([^'")]+)['"]?/i);
  if (match) {
    bgUrl = match[1];
  }
  let bgImg = null;
  if (bgUrl) {
    bgImg = document.createElement('img');
    bgImg.src = bgUrl;
    bgImg.alt = '';
  }

  // 3. Content row: headline and CTA (link)
  // The text is inside .home-banner__desc
  const desc = element.querySelector('.home-banner__desc');
  let content = [];
  if (desc && desc.textContent.trim()) {
    const heading = document.createElement('h1');
    heading.textContent = desc.textContent.trim();
    content.push(heading);
  }
  // CTA link (always present as <a> itself)
  if (element.href) {
    // If the main text is not already the link, add a CTA link
    const cta = document.createElement('a');
    cta.href = element.href;
    cta.textContent = 'Learn more';
    content.push(cta);
  }

  // Compose rows
  const rows = [
    headerRow,
    [bgImg],
    [content],
  ];
  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
