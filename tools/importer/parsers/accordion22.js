/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, as in the example
  const rows = [['Accordion (accordion22)']];

  // Get all direct children with class 'card'
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach((card) => {
    // Title cell: get .card-header (title is heading inside)
    const headerEl = card.querySelector(':scope > .card-header');
    let titleContent;
    // prefer the heading if present, else full header
    const heading = headerEl ? headerEl.querySelector('h1, h2, h3, h4, h5, h6') : null;
    if (heading) {
      // reference all its child nodes (to preserve formatting)
      titleContent = Array.from(heading.childNodes);
    } else if (headerEl) {
      titleContent = Array.from(headerEl.childNodes).filter((n) => n.nodeType !== Node.COMMENT_NODE && (n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== ''));
    } else {
      titleContent = [''];
    }

    // Content cell: get .collapse > .card-body (all content, including media and lists)
    const bodyEl = card.querySelector('.collapse > .card-body');
    let contentContent;
    if (bodyEl) {
      // include all (non-empty) child nodes
      contentContent = Array.from(bodyEl.childNodes).filter((n) => n.nodeType !== Node.COMMENT_NODE && (n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== ''));
      if (contentContent.length === 0) contentContent = [''];
    } else {
      contentContent = [''];
    }

    rows.push([
      titleContent.length === 1 ? titleContent[0] : titleContent,
      contentContent.length === 1 ? contentContent[0] : contentContent,
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
