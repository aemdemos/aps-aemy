/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must be exactly 'Search' in a single column
  const headerRow = ['Search'];

  // Prefer the .search-catalogue element, else fallback to all children
  let searchContent = element.querySelector('.search-catalogue');
  let rowContent;

  if (searchContent) {
    // Include all child nodes of searchContent, including text nodes
    rowContent = Array.from(searchContent.childNodes).filter(
      (node) => {
        // Include all elements and non-empty text nodes
        return (node.nodeType !== Node.TEXT_NODE) || (node.textContent.trim().length > 0);
      }
    );
  } else {
    // Fallback: include all child nodes of the main element
    rowContent = Array.from(element.childNodes).filter(
      (node) => {
        return (node.nodeType !== Node.TEXT_NODE) || (node.textContent.trim().length > 0);
      }
    );
  }
  // If no content found, use the element itself
  if (!rowContent || rowContent.length === 0) {
    rowContent = [element];
  }

  const cells = [
    headerRow,
    [rowContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
