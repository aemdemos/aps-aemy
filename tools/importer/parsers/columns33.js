/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Columns (columns33)'];

  // 2. Get left and right main column elements
  // Columns are: left = description/content, right = image
  // Get immediate children of top-level block for resilience
  const directChildren = Array.from(element.children);

  // Find .media-body and .media-right reliably
  let mediaBody = null;
  let mediaRight = null;
  directChildren.forEach((child) => {
    if (child.classList.contains('media-body')) mediaBody = child;
    if (child.classList.contains('media-right')) mediaRight = child;
  });

  // LEFT COLUMN: Compose content
  const leftContent = [];
  if (mediaBody) {
    // Title (h3)
    const h3 = Array.from(mediaBody.children).find(el => el.tagName === 'H3');
    if (h3) leftContent.push(h3);

    // Description (first div, could be .s-lc-c-evt-des)
    const des = Array.from(mediaBody.children).find(el => el.tagName === 'DIV');
    if (des) leftContent.push(des);

    // Details (dl)
    const dl = Array.from(mediaBody.children).find(el => el.tagName === 'DL');
    if (dl) leftContent.push(dl);
  }
  // If nothing found, ensure fallback
  const leftCell = (leftContent.length > 0) ? leftContent : '';

  // RIGHT COLUMN: Compose content
  let rightCell = '';
  if (mediaRight) {
    // Only image, but could be wrapped in a link
    // Find the image inside mediaRight (not the link itself!)
    const img = mediaRight.querySelector('img');
    if (img) rightCell = img;
  }

  // 3. Table construction
  // Only one table as per example
  const tableData = [
    headerRow,
    [leftCell, rightCell]
  ];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // 4. Replace the element
  element.replaceWith(block);
}
