/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly as required
  const headerRow = ['Accordion (accordion27)'];

  // Find all direct card elements inside the accordion
  const cards = element.querySelectorAll(':scope > .card');

  // Prepare rows starting with the header
  const rows = [headerRow];

  cards.forEach(card => {
    // Title for the accordion: from .card-header (e.g. an h2)
    let titleContent;
    const header = card.querySelector('.card-header');
    if (header) {
      // Use all child nodes directly to preserve heading levels and formatting
      titleContent = Array.from(header.childNodes);
    } else {
      titleContent = '';
    }

    // Content for the accordion: from .collapse > .card-body
    let contentContent;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // Use all child nodes of cardBody, preserving paragraphs, lists, and formatting
        contentContent = Array.from(cardBody.childNodes);
      } else {
        contentContent = '';
      }
    } else {
      contentContent = '';
    }

    rows.push([
      titleContent,
      contentContent,
    ]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
