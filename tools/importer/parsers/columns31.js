/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Convert iframes (non-images) to links
  function iframeToLink(iframeEl) {
    if (!iframeEl) return null;
    const src = iframeEl.getAttribute('src');
    if (!src) return null;
    const a = document.createElement('a');
    a.href = src;
    a.textContent = iframeEl.title || 'Chat Widget';
    return a;
  }

  // Select the immediate child columns
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;

  // LEFT COLUMN: combine all child nodes (including text!) for robust text extraction
  const leftCol = columns[0];
  const leftContent = Array.from(leftCol.childNodes).filter(
    node => node.nodeType !== Node.COMMENT_NODE && !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
  );

  // RIGHT COLUMN: combine all child nodes, but iframes must be replaced by links
  const rightCol = columns[1];
  const rightContent = [];
  Array.from(rightCol.childNodes).forEach((node) => {
    if (node.nodeName === 'IFRAME') {
      // Replace iframe with link
      const link = iframeToLink(node);
      if (link) rightContent.push(link);
    } else {
      rightContent.push(node);
    }
  });

  // Only create the table if at least one of the columns has content
  if (leftContent.length === 0 && rightContent.length === 0) return;

  // Block header must match the spec exactly
  const cells = [
    ['Columns (columns31)'],
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
