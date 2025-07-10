/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects a single table: header 'Search',
  // and a cell containing the entire search UI with all text, form, buttons, options, etc.
  // We must ensure ALL text content (including placeholders, button labels, radio controls, etc.) is preserved.

  // Reference the entire search block: in this HTML, this is the top-level element.
  // By referencing 'element' directly, we retain all nested content and semantic structure.
  // Do NOT clone. Instead, reference the original element so that all content and text is preserved for the importer to transform.
  
  // Create the block table as required (1 col, 2 rows)
  const table = WebImporter.DOMUtils.createTable([
    ['Search'],
    [element]
  ], document);

  // Replace the original element with our table
  element.replaceWith(table);
}
