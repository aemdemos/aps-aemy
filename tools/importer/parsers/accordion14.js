/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as specified
  const cells = [['Accordion (accordion14)']];
  // Each card is an accordion item
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title cell
    let titleEl = card.querySelector('.card-header');
    let titleCell = '';
    if (titleEl) {
      // Prefer the heading if present, but reference the actual heading element
      let heading = titleEl.querySelector('h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // If no heading, use the card-header itself
        titleCell = titleEl;
      }
    }
    // Content cell
    // Use the .card-body, but replace iframes with links (reference existing element when possible)
    let contentCellNodes = [];
    const cardBody = card.querySelector('.collapse > .card-body');
    if (cardBody) {
      // For each child of cardBody, use as-is, but for iframes, convert to link
      cardBody.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
          // If <p> contains an iframe, replace with a link
          const iframe = node.querySelector('iframe');
          if (iframe) {
            const src = iframe.getAttribute('src');
            if (src) {
              const a = document.createElement('a');
              a.href = src;
              a.textContent = src;
              // Make a new <p> to match block structure
              const p = document.createElement('p');
              p.appendChild(a);
              contentCellNodes.push(p);
              return;
            }
          }
        }
        // For all nodes not handled above, reference directly
        contentCellNodes.push(node);
      });
    }
    // Push the row: two columns: title, content
    cells.push([
      titleCell,
      contentCellNodes
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
