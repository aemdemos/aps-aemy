/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified by block name
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];
  // All direct children .card (accordion items)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // TITLE cell: Find .card-header h2 (or fallback to .card-header text if needed)
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        titleCell = h2;
      } else {
        // fallback: text content of header
        titleCell = document.createElement('span');
        titleCell.textContent = header.textContent.trim();
      }
    }

    // CONTENT cell: find .collapse .card-body
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        // Collect all direct children of .card-body, flattening wrapper divs if present
        const children = [];
        // If card-body contains only one div, and *that* div contains multiple direct children, flatten one level
        if (body.childElementCount === 1 && body.firstElementChild.tagName === 'DIV') {
          const wrapper = body.firstElementChild;
          // If wrapper contains all divs, flatten further
          if ([...wrapper.children].every(e => e.tagName === 'DIV')) {
            for (const child of wrapper.children) {
              // If div contains only one child (e.g., <div><p>...</p></div>) unwrap it
              if (child.childElementCount === 1) {
                children.push(child.firstElementChild);
              } else {
                children.push(child);
              }
            }
          } else {
            // wrapper itself is meaningful
            children.push(wrapper);
          }
        } else {
          // Otherwise, just use all children
          for (const child of body.children) {
            // If divs that only wrap a p, unwrap
            if (child.tagName === 'DIV' && child.childElementCount === 1 && child.firstElementChild.tagName === 'P') {
              children.push(child.firstElementChild);
            } else {
              children.push(child);
            }
          }
        }
        // If nothing found, fallback to body itself
        contentCell = children.length > 0 ? children : [body];
      } else {
        contentCell = [''];
      }
    } else {
      contentCell = [''];
    }
    rows.push([titleCell, contentCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
