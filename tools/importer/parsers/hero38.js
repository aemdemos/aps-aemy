/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should match the block name exactly
  const headerRow = ['Hero (hero38)'];

  // Extract background image url from style attribute
  let bgUrl = '';
  if (element.hasAttribute('style')) {
    const style = element.getAttribute('style');
    const match = style.match(/background:\s*url\(['"]?([^'"]+)['"]?/i);
    if (match && match[1]) {
      bgUrl = match[1];
    }
  }
  // If image exists, use single cell with image element
  let imageEl = null;
  if (bgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgUrl;
    imageEl.alt = '';
  }
  const imageRow = [imageEl];

  // Content row: get all content from the banner except the background image
  // We want the *visible* text in the banner, organized semantically
  // The structure is: <a ...> <div> <div>Text content</div> </div> </a>
  // We'll use the innermost child (the message div) as the main content
  let contentCellElements = [];
  // Try to grab the main description/message
  const desc = element.querySelector('.home-banner__desc');
  if (desc && desc.textContent.trim()) {
    // Create a heading element for the description
    const heading = document.createElement('h2');
    heading.textContent = desc.textContent.trim();
    contentCellElements.push(heading);
  }
  // Always include a call-to-action link using the banner's href if present
  if (element.href) {
    const link = document.createElement('a');
    link.href = element.href;
    // Use the description as link text if available
    link.textContent = desc && desc.textContent.trim() ? desc.textContent.trim() : element.href;
    contentCellElements.push(link);
  }
  // If no content found, fallback to any textContent
  if (contentCellElements.length === 0 && element.textContent.trim()) {
    const fallback = document.createElement('p');
    fallback.textContent = element.textContent.trim();
    contentCellElements.push(fallback);
  }
  const contentRow = [contentCellElements];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
