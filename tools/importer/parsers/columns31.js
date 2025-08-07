/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a link for iframes (non-image src elements)
  function createLinkFromIframe(iframe) {
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.title || iframe.src || 'Link';
    return a;
  }

  // Get left and right columns directly from the original document
  const firstCol = element.querySelector('.code_snippet_first');
  const secondCol = element.querySelector('.code_snippet_second');

  // For second (right) column, modify the DOM in-place by swapping iframes for links
  if (secondCol) {
    secondCol.querySelectorAll('iframe').forEach((iframe) => {
      const link = createLinkFromIframe(iframe);
      iframe.replaceWith(link);
    });
  }

  // Table: first row is the header, second row is the two columns
  const headerRow = ['Columns (columns31)'];
  const columnsRow = [firstCol, secondCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
