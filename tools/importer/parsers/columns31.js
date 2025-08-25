/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Columns (columns31)'];

  // Get the two columns
  const leftCol = element.querySelector('.code_snippet_first');
  const rightCol = element.querySelector('.code_snippet_second');

  // Helper: get all meaningful children (including text nodes) for a column
  function getColumnContent(col) {
    if (!col) return [];
    const contents = [];
    for (const child of col.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        contents.push(child);
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = child.textContent;
        contents.push(span);
      }
    }
    return contents;
  }

  // Get contents for each column
  const leftContent = getColumnContent(leftCol);
  const rightContent = getColumnContent(rightCol);

  // Always 2 columns for this block
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
