/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to replace any non-img element with a src with a link (for iframes, etc)
  function replaceNonImgSrcElements(root) {
    const srcEls = Array.from(root.querySelectorAll('[src]')).filter(el => el.tagName.toLowerCase() !== 'img');
    srcEls.forEach(el => {
      const href = el.getAttribute('src');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = href;
        el.parentNode && el.parentNode.replaceChild(a, el);
      }
    });
  }

  // Helper to get content for a column: keep all nodes (including text!)
  function extractColumnContent(col) {
    replaceNonImgSrcElements(col);
    // Grabs all nodes (including text and elements), skips empty text
    const nodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() !== '';
      return true;
    });
    // If only one node (element or text), just return it, else return array
    if (nodes.length === 1) return nodes[0];
    return nodes;
  }

  // Find the two top-level columns
  // Look for direct children divs (not descendants)
  const columns = Array.from(element.children).filter(el => el.tagName.toLowerCase() === 'div');

  const headerRow = ['Columns (columns31)'];
  let cells;
  if (columns.length === 2) {
    const col1 = extractColumnContent(columns[0]);
    const col2 = extractColumnContent(columns[1]);
    cells = [headerRow, [col1, col2]];
  } else {
    // fallback: treat the element as one column (all content)
    cells = [headerRow, [extractColumnContent(element)]];
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
