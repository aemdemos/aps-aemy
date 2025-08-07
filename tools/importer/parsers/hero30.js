/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare rows for the Hero block table
  const rows = [];

  // 1. Header row: Block name, exactly 'Hero'
  rows.push(['Hero']);

  // 2. Background image row: empty string as there is no image in input
  rows.push(['']);

  // 3. Content row: All content (including text nodes and links) in the single cell
  // If the element is a <p> with a link and possibly text, capture all its children
  const content = Array.from(element.childNodes);
  // If there is no content (edge case), use an empty string
  rows.push([content.length ? content : '']);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
