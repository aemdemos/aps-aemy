/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // Get each row (each >div in .columns.block)
  const rows = Array.from(block.children);
  // For the header row, use a single cell array as in the example
  const cells = [['Columns']];

  // For each row, build an array of its immediate children (columns)
  rows.forEach(row => {
    const cols = Array.from(row.children);
    // Push the array of elements as-is, since each row is a block row
    cells.push(cols);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
