/* global WebImporter */
export default function parse(element, { document }) {
  // Get the immediate <p> child containing the links
  const p = element.querySelector('p');
  if (!p) return;

  // Get all <a> elements directly inside the <p>
  const links = Array.from(p.querySelectorAll('a'));
  if (links.length === 0) return; // No links, do nothing

  // Each link should be a separate column
  const header = ['Columns (columns9)'];
  const row = links;

  const table = WebImporter.DOMUtils.createTable([
    header,
    row
  ], document);

  element.replaceWith(table);
}
