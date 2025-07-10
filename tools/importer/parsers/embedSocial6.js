/* global WebImporter */
export default function parse(element, { document }) {
  // Goal: Replace the element with an Embed block table (header: 'Embed', body: all text content)
  // 1. Extract all visible text content from the element and its children (excluding overlays and loaders)
  // 2. Reference (not clone) the text content, as a <p> in the cell if non-empty
  // 3. Table must be [['Embed'], [content]]

  // Helper to extract text from visible elements only (exclude overlays/loaders)
  function isIrrelevant(node) {
    if (!node.classList) return false;
    return node.classList.contains('tab_overlay') || node.classList.contains('lcs_load');
  }

  function collectTextNodes(el, arr) {
    if (isIrrelevant(el)) return;
    if (el.nodeType === Node.TEXT_NODE) {
      if (el.textContent.trim()) arr.push(el.textContent.trim());
      return;
    }
    el.childNodes.forEach((child) => {
      collectTextNodes(child, arr);
    });
  }

  // Get all visible text content
  const textArr = [];
  collectTextNodes(element, textArr);
  const text = textArr.join(' ').replace(/\s+/g, ' ').trim();

  let blockContent;
  if (text) {
    // Reference the element with main header if possible
    // Use the header link (e.g. "Online Librarian") as a <p> if it exists
    const headerLink = element.querySelector('.lcs_header');
    if (headerLink) {
      // Use the header as a paragraph and include remaining text if any
      const para = document.createElement('p');
      para.textContent = text;
      blockContent = para;
    } else {
      // Just use text in a <p>
      const para = document.createElement('p');
      para.textContent = text;
      blockContent = para;
    }
  } else {
    blockContent = '';
  }

  const cells = [
    ['Embed'],
    [blockContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
