/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child .card elements
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  const rows = [
    ['Accordion (accordion7)'],
  ];

  cards.forEach(card => {
    // Title: Use .card-header > h2 if available, else whole .card-header
    let titleEl = card.querySelector('.card-header h2') || card.querySelector('.card-header');
    // Reference the element directly
    let titleCell = titleEl;

    // Content: .card-body
    const body = card.querySelector('.card-body');
    let contentCell = '';
    if (body) {
      // Sometimes .card-body holds a div, sometimes multiple wrappers
      // We'll flatten all meaningful children (including nested wrappers)
      let contentNodes = [];
      function collectContent(node) {
        // Recursively collect all element children of node
        for (const child of node.children) {
          // If child is a div with just a div, flatten
          if (child.tagName === 'DIV' && child.children.length === 1 && child.children[0].tagName === 'DIV') {
            collectContent(child);
          } else {
            contentNodes.push(child);
          }
        }
      }
      collectContent(body);
      // Remove empty wrappers
      contentNodes = contentNodes.filter(n => {
        if (n.tagName === 'DIV' && n.children.length === 0 && !n.textContent.trim()) return false;
        return true;
      });
      // If there's only one element, pass as element, else as array
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        // fallback to .card-body's text if empty
        contentCell = body.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
