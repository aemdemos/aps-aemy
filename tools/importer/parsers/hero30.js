/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Hero'];
  // Background image row (empty for this case)
  const imgRow = [''];

  // Content: include everything inside the element (all children)
  // If the element is empty, provide an empty string
  let content;
  if (element.childNodes.length > 0) {
    // Collect all child nodes in an array for the cell
    content = Array.from(element.childNodes);
  } else {
    content = [''];
  }
  const contentRow = [content];

  // Build the table as per the required structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imgRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}