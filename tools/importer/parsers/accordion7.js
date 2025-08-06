/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];
  // Get all immediate child .card elements (each accordion item)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Extract the title cell
    let title = '';
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        title = h2.textContent.trim();
      } else {
        title = header.textContent.trim();
      }
    }
    // Extract the content cell, referencing the original elements
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // Flatten if there are extra wrapper divs
        let contentRoot = cardBody;
        // If cardBody contains only one child and it is a div, use that div
        while (
          contentRoot.children.length === 1 &&
          contentRoot.children[0].tagName === 'DIV'
        ) {
          contentRoot = contentRoot.children[0];
        }
        // If contentRoot has multiple direct children (e.g. <div>, <p>, etc.)
        // Use all as the cell content (as array)
        const nodes = Array.from(contentRoot.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '');
        if (nodes.length === 1) {
          contentCell = nodes[0];
        } else if (nodes.length > 1) {
          contentCell = nodes;
        } else {
          contentCell = '';
        }
      } else {
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    rows.push([title, contentCell]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
