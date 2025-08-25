/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review ---
  // 1. Only one accordion item in the provided HTML
  // 2. Block header matches exactly: 'Accordion (accordion2)'
  // 3. All content must be referenced (not hardcoded or cloned)
  // 4. No Section Metadata table present in the markdown example
  // 5. Semantic meaning preserved: heading level, lists
  // 6. Edge case: if any component is missing, skip its row

  const headerRow = ['Accordion (accordion2)'];

  // Find the accordion title
  let titleContainer = element.querySelector('.card-header');
  let titleEl = null;
  if (titleContainer) {
    // Prefer heading inside card-header
    titleEl = titleContainer.querySelector('h1,h2,h3,h4,h5,h6');
    if (!titleEl) {
      // fallback: use card-header itself if no heading
      titleEl = titleContainer;
    }
  }

  // Find the content (body)
  let bodyContainer = element.querySelector('.card-body');
  let contentEl = null;
  if (bodyContainer) {
    // The bodyContainer is a div containing a ul with a p and li's
    // We should preserve the list structure and reference the div directly
    contentEl = bodyContainer;
  }

  // Build rows
  const rows = [headerRow];
  if (titleEl && contentEl) {
    rows.push([
      titleEl,
      contentEl
    ]);
  }
  // If title or content is missing, don't add item row

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}