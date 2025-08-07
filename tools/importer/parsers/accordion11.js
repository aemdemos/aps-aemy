/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row as per spec
  const rows = [
    ['Accordion (accordion11)']
  ];

  // Get all immediate .card children (accordion items)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title cell: get direct .card-header child (not descendant)
    let titleElem = card.querySelector(':scope > .card-header');
    let titleContent = null;
    if (titleElem) {
      // Use the heading if present, or the whole card-header if not
      const headerHeading = titleElem.querySelector('h1, h2, h3, h4, h5, h6');
      titleContent = headerHeading ? headerHeading : titleElem;
    }

    // Content cell: look for .collapse > .card-body
    let collapseElem = card.querySelector(':scope > .collapse');
    let cardBody = collapseElem ? collapseElem.querySelector(':scope > .card-body') : null;
    let bodyContent = null;
    if (cardBody) {
      // Collect all child nodes, preserving text nodes and elements
      // Remove whitespace-only text nodes
      bodyContent = Array.from(cardBody.childNodes).filter(n => {
        if (n.nodeType === 3) {
          // Text node, only keep if not just whitespace
          return n.textContent.trim().length > 0;
        }
        return true;
      });
      // If only 1 content node, use it directly
      if (bodyContent.length === 1) {
        bodyContent = bodyContent[0];
      }
    }

    rows.push([
      titleContent,
      bodyContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
