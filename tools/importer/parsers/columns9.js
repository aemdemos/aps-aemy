/* global WebImporter */
export default function parse(element, { document }) {
  // Get the direct <p> child, which contains the two links
  // Defensive: if there is no <p>, fallback to the element's content
  let contentCell;
  const p = element.querySelector('p');
  if (p) {
    contentCell = p;
  } else {
    // If <p> is not present, create a fragment with all children
    const frag = document.createDocumentFragment();
    Array.from(element.childNodes).forEach(node => frag.appendChild(node));
    contentCell = frag;
  }

  // Compose the table structure
  const cells = [
    ['Columns (columns9)'], // header must match the spec
    [contentCell]
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}