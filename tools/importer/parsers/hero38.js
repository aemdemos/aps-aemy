/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Hero (hero38)'];

  // Row 2: Background image from inline style if present
  let imgEl = null;
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background\s*:\s*url\(['"]?([^'"]+)['"]?/i);
  if (bgMatch && bgMatch[1]) {
    imgEl = document.createElement('img');
    imgEl.src = bgMatch[1];
    imgEl.alt = '';
  }

  // Row 3: All visual/semantic content from the element
  // We'll create a container to gather the block's visible content
  const contentFragment = document.createDocumentFragment();
  // Gather all text content in the .home-banner__desc (or fallback)
  let descText = '';
  const descEl = element.querySelector('.home-banner__desc');
  if (descEl && descEl.textContent.trim()) {
    descText = descEl.textContent.trim();
  } else {
    // fallback: get the text content of the element (excluding descendants with their own text)
    descText = element.textContent.trim();
  }
  if (descText) {
    // Use heading element for banner text (preserve semantic intent)
    const heading = document.createElement('h2');
    heading.textContent = descText;
    contentFragment.appendChild(heading);
  }

  // If the top-level element is a link, treat as CTA as well
  if (element.tagName === 'A' && element.href && descText) {
    const cta = document.createElement('a');
    cta.href = element.href;
    cta.textContent = descText;
    contentFragment.appendChild(cta);
  }

  // Compose rows
  const cells = [
    headerRow,
    [imgEl || ''],
    [contentFragment.childNodes.length ? Array.from(contentFragment.childNodes) : '']
  ];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
