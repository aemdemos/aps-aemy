/* global WebImporter */
export default function parse(element, { document }) {
  // The "Hero" block expects: header, (optional) background image row, then content row.
  // There is no background image, so leave that row empty.
  // Content row should include all text and child nodes of the original element.
  const headerRow = ['Hero'];
  const bgRow = ['']; // no background image

  // To ensure we capture all text and inline nodes (not just elements)
  // collect all childNodes, not just children
  const contentNodes = Array.from(element.childNodes);
  // If there is only one node, use it as is, otherwise pass as array
  const contentRow = [contentNodes.length === 1 ? contentNodes[0] : contentNodes];

  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}