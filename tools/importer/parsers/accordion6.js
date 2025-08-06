/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row with the exact block name
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  // Each accordion item is a .card direct child
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach((card) => {
    // Get the title: prefer .card-header h2 but fallback to .card-header
    let titleEl = card.querySelector('.card-header h2');
    if (!titleEl) {
      titleEl = card.querySelector('.card-header');
    }

    // Get the content cell: .card-body
    const bodyEl = card.querySelector('.card-body');
    let contentCell = '';
    if (bodyEl) {
      // Flatten nested divs (e.g., <div><div><p>...</p></div></div>)
      let contentNodes = [];
      let walker = bodyEl;
      // If the only child is a DIV, and that DIV's only children are DIVs, collect all their children
      // Otherwise, collect all children of .card-body
      let children = Array.from(walker.childNodes);
      if (
        children.length === 1 &&
        children[0].nodeType === Node.ELEMENT_NODE &&
        children[0].tagName === 'DIV'
      ) {
        let deepDivs = Array.from(children[0].childNodes);
        // If all are divs, collect their children
        if (deepDivs.length > 0 && deepDivs.every(n => n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV')) {
          deepDivs.forEach(d => {
            contentNodes.push(...Array.from(d.childNodes));
          });
        } else {
          contentNodes = deepDivs;
        }
      } else {
        contentNodes = children;
      }
      // Remove whitespace-only text nodes
      contentNodes = contentNodes.filter(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent.trim().length > 0;
        }
        return true;
      });
      if (contentNodes.length > 0) {
        contentCell = contentNodes;
      }
    }
    rows.push([titleEl, contentCell]);
  });

  // Create accordion block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
