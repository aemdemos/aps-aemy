/* global WebImporter */
export default function parse(element, { document }) {
  // Header must be an array with a single cell, exactly matching the block name.
  const headerRow = ['Columns (columns33)'];

  // Extract left (content) and right (image) columns
  const mediaBody = element.querySelector('.media-body');
  const mediaRight = element.querySelector('.media-right');

  // Compose left column: heading, description, details
  const leftColumnContent = [];
  if (mediaBody) {
    const heading = mediaBody.querySelector('.media-heading');
    if (heading) leftColumnContent.push(heading);
    const desc = mediaBody.querySelector('.s-lc-c-evt-des');
    if (desc) leftColumnContent.push(desc);
    const dl = mediaBody.querySelector('dl');
    if (dl) leftColumnContent.push(dl);
  }
  // Compose right column: image only
  let imageElem = '';
  if (mediaRight) {
    const img = mediaRight.querySelector('img');
    if (img) imageElem = img;
  }

  // Compose rows: header row is single column, data row is two columns
  const cells = [
    headerRow,
    [leftColumnContent, imageElem]
  ];

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
