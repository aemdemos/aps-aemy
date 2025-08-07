/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: matches the block name exactly as in the example
  const headerRow = ['Hero (hero38)'];

  // 2. Background image row (row 2)
  let bgUrl = '';
  const style = element.getAttribute('style') || '';
  const match = style.match(/background:\s*url\(['"]?([^'")]+)['"]?/);
  if (match && match[1]) {
    bgUrl = match[1];
  }
  let imageEl = null;
  if (bgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgUrl;
    imageEl.alt = '';
  }

  // 3. Content row (row 3): get banner text and link
  const desc = element.querySelector('.home-banner__desc');
  let contentCell = '';
  if (desc) {
    // Since the whole banner is a link (element is <a>), template the text as a heading with a link
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = element.href;
    a.textContent = desc.textContent.trim();
    p.appendChild(a);
    contentCell = p;
  }

  // Build the table rows
  const rows = [
    headerRow,                            // header row
    [imageEl ? imageEl : ''],             // background image row
    [contentCell],                        // content row
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
