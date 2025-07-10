/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image URL from style attribute
  const style = element.getAttribute('style') || '';
  let bgUrl = '';
  const match = style.match(/background:\s*url\(['"]?([^'")]+)['"]?/);
  if (match && match[1]) {
    bgUrl = match[1];
  }

  // Create image element for background if present
  let bgImg = '';
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = '';
    bgImg = img;
  }

  // Extract content: headline, CTA
  // Find banner description element
  let content = '';
  const desc = element.querySelector('.home-banner__desc');
  if (desc) {
    // Create heading for the banner text
    const heading = document.createElement('h2');
    heading.textContent = desc.textContent.trim();
    // If there's a link (the <a> element), wrap the heading in a link
    const href = element.getAttribute('href');
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = heading.textContent;
      heading.textContent = '';
      heading.appendChild(a);
    }
    content = heading;
  }

  // Compose table rows as per the instructions: Header, Image, Content
  const rows = [
    ['Hero'],
    [bgImg],
    [content]
  ];
  // Create block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
