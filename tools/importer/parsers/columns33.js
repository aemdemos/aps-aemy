/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must have exactly one column
  const headerRow = ['Columns (columns33)'];

  // Split into two columns: left (media-body), right (media-right)
  const mediaBody = element.querySelector('.media-body');
  const mediaRight = element.querySelector('.media-right');

  // Gather all left column content
  const leftColumnContent = [];
  if (mediaBody) {
    const heading = mediaBody.querySelector('h3');
    if (heading) leftColumnContent.push(heading);
    const description = mediaBody.querySelector('.s-lc-c-evt-des');
    if (description) leftColumnContent.push(description);
    const dl = mediaBody.querySelector('dl');
    if (dl) leftColumnContent.push(dl);
  }

  // Gather right column image (only the <img>, not the link)
  let rightColumnContent = '';
  if (mediaRight) {
    const img = mediaRight.querySelector('img');
    if (img) rightColumnContent = img;
  }

  // Second row: two columns
  const dataRow = [leftColumnContent, rightColumnContent];

  // Compose the cells array with exactly one-column header row
  const cells = [headerRow, dataRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
