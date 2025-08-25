/* global WebImporter */
export default function parse(element, { document }) {
  // Set the header exactly
  const headerRow = ['Columns (columns31)'];

  // Each column is a side of the block: left (hours) and right (librarian)
  // Extract the left and right columns
  const firstCol = element.querySelector('.code_snippet_first');
  const secondCol = element.querySelector('.code_snippet_second');

  // If either is missing, use an empty div to preserve columns
  const leftContent = firstCol ? firstCol : document.createElement('div');
  const rightContent = secondCol ? secondCol : document.createElement('div');

  // Remove any inline style attributes from top-level columns
  leftContent.removeAttribute('style');
  rightContent.removeAttribute('style');

  // Remove .fa icons from headings for semantic preservation
  leftContent.querySelectorAll('i.fa').forEach(icon => icon.remove());
  rightContent.querySelectorAll('i.fa').forEach(icon => icon.remove());

  // Remove input[type=radio] and <nav> from leftContent, which are for tab mechanism only
  leftContent.querySelectorAll('input[type="radio"], nav').forEach(el => el.remove());

  // Remove aria-hidden icons (redundant, but safe)
  leftContent.querySelectorAll('[aria-hidden]').forEach(el => el.remove());
  rightContent.querySelectorAll('[aria-hidden]').forEach(el => el.remove());

  // The structure is a 2-column block: left is the full hours/tabs block, right is the librarian block
  // All semantic and text content is retained by referencing existing elements
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
