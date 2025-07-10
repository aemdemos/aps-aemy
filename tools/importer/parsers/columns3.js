/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns in the source HTML
  const leftCol = element.querySelector('.code_snippet_first');
  const rightCol = element.querySelector('.code_snippet_second');

  // Header row for columns block
  const headerRow = ['Columns'];

  // Prepare left column: remove inline styles and decorative icon(s)
  let leftContent = null;
  if (leftCol) {
    leftCol.removeAttribute('style');
    const h2 = leftCol.querySelector('h2.snippet');
    if (h2) {
      const icon = h2.querySelector('i');
      if (icon) icon.remove();
    }
    leftContent = leftCol;
  }

  // Prepare right column: remove style, icon, and replace iframe with link
  let rightContent = null;
  if (rightCol) {
    rightCol.removeAttribute('style');
    const h2 = rightCol.querySelector('h2.snippet');
    if (h2) {
      const icon = h2.querySelector('i');
      if (icon) icon.remove();
    }
    // Replace iframe with a link to its src (if any)
    const iframe = rightCol.querySelector('iframe[src]');
    if (iframe) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.title || 'Chat Widget';
      iframe.replaceWith(link);
    }
    rightContent = rightCol;
  }

  // If either column is missing, fallback to empty cell
  const dataRow = [leftContent || '', rightContent || ''];

  // Compose the block table
  const cells = [headerRow, dataRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
