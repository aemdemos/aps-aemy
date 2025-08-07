/* global WebImporter */
export default function parse(element, { document }) {
  function getChildByClass(parent, className) {
    for (const child of parent.children) {
      if (child.classList && child.classList.contains(className)) return child;
    }
    return null;
  }

  const leftCol = getChildByClass(element, 'media-body');
  const rightCol = getChildByClass(element, 'media-right');

  const leftContent = [];
  if (leftCol) {
    const h3 = leftCol.querySelector('h3');
    if (h3) leftContent.push(h3);
    const descDiv = leftCol.querySelector('.s-lc-c-evt-des');
    if (descDiv) {
      Array.from(descDiv.children).forEach(child => {
        leftContent.push(child);
      });
    }
    const dl = leftCol.querySelector('dl');
    if (dl) leftContent.push(dl);
  }

  const rightContent = [];
  if (rightCol) {
    const imgLink = rightCol.querySelector('a');
    if (imgLink && imgLink.querySelector('img')) {
      const img = imgLink.querySelector('img');
      rightContent.push(img);
    } else {
      const img = rightCol.querySelector('img');
      if (img) rightContent.push(img);
    }
  }

  // Compose the table rows
  const dataRow = [leftContent, rightContent];

  // Create table using DOMUtils and then fix header colspan
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns33)'],
    dataRow,
  ], document);

  // Fix the header row to have a single th with correct colspan
  const headerRow = table.querySelector('tr');
  const th = headerRow && headerRow.querySelector('th');
  if (th && dataRow.length > 1) {
    th.setAttribute('colspan', dataRow.length);
  }

  element.replaceWith(table);
}
