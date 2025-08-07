/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left (media-body) and right (media-right) columns
  const leftCol = element.querySelector('.media-body');
  const rightCol = element.querySelector('.media-right');

  // Prepare the left column content
  const leftContent = document.createElement('div');
  // Heading (preserve the <h3> and its child <a>)
  const heading = leftCol.querySelector('.media-heading');
  if (heading) leftContent.appendChild(heading);
  // Description (all event description paragraphs)
  const desc = leftCol.querySelector('.s-lc-c-evt-des');
  if (desc) leftContent.appendChild(desc);
  // Details list (dates, location, etc)
  const details = leftCol.querySelector('dl');
  if (details) leftContent.appendChild(details);

  // For the right column, use the image inside the link (reference existing element)
  let rightContent = '';
  if (rightCol) {
    const imgLink = rightCol.querySelector('a');
    if (imgLink) {
      rightContent = imgLink;
    } else {
      const img = rightCol.querySelector('img');
      if (img) rightContent = img;
    }
  }

  // The header row must have the same number of columns as the content row
  const headerRow = ['Columns (columns33)', ''];
  const contentRow = [leftContent, rightContent];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
