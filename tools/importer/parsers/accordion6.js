/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row
  const headerRow = ['Accordion (accordion6)'];
  // Find all direct children with class 'card' (accordion item)
  const cardElements = Array.from(element.querySelectorAll(':scope > .card'));
  const rows = [headerRow];

  cardElements.forEach((card) => {
    // Title cell: the .card-header > heading (keep reference to existing element)
    const titleContainer = card.querySelector(':scope > .card-header');
    let titleEl = null;
    // Use heading tag if available, otherwise use the card-header itself
    if (titleContainer) {
      titleEl = titleContainer.querySelector('h1, h2, h3, h4, h5, h6');
      if (!titleEl) titleEl = titleContainer;
    }

    // Content cell: .collapse > .card-body (reference existing container)
    let contentEl = null;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      contentEl = collapse.querySelector('.card-body');
      // If card-body exists, but only has inner div wrappers, flatten them
      if (contentEl && contentEl.childElementCount === 1 && contentEl.firstElementChild.tagName.toLowerCase() === 'div') {
        // If only one div wrapper, and it contains more divs, flatten those
        const innerDivs = contentEl.firstElementChild.querySelectorAll(':scope > div');
        if (innerDivs.length > 0) {
          contentEl = document.createElement('div');
          innerDivs.forEach(div => {
            Array.from(div.childNodes).forEach(node => contentEl.appendChild(node));
          });
        }
      }
    }
    rows.push([
      titleEl || '',
      contentEl || ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
