/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion8) block header
  const headerRow = ['Accordion (accordion8)'];
  const cells = [headerRow];

  // Get all direct child .card elements (accordion items)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title cell: find the element that represents the title
    // Usually in .card-header > h2 (but fallback to .card-header if no h2)
    let titleEl = null;
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      titleEl = h2 || cardHeader;
    }

    // Content cell: get the body content
    let contentCell = [];
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      // We want to reference real child elements, not clones
      // But we may need to replace iframes with links as per requirements
      // For this, process each child node:
      const processedNodes = [];
      cardBody.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
          // Replace any iframe inside the <p> with a link if present
          const iframe = node.querySelector('iframe');
          if (iframe) {
            // Only if it's not an image (which it isn't)
            const link = document.createElement('a');
            link.href = iframe.src;
            link.textContent = iframe.src;
            // Create a new <p> containing the link (preserves paragraph spacing)
            const p = document.createElement('p');
            p.appendChild(link);
            processedNodes.push(p);
            // Also add other content in the <p> (if any)
            // If the <p> has other child nodes before/after iframe
            Array.from(node.childNodes).forEach(n => {
              if (n !== iframe && (n.textContent && n.textContent.trim() !== '')) {
                processedNodes.push(n);
              }
            });
          } else {
            processedNodes.push(node);
          }
        } else {
          processedNodes.push(node);
        }
      });
      // Remove empty text nodes
      contentCell = processedNodes.filter(n => {
        return (
          n.nodeType !== Node.TEXT_NODE || (n.textContent && n.textContent.trim() !== '')
        );
      });
    }

    // If nothing found, put a blank placeholder
    if (!titleEl) {
      titleEl = document.createElement('span');
      titleEl.textContent = '';
    }
    if (!contentCell || contentCell.length === 0) {
      const p = document.createElement('p');
      p.textContent = '';
      contentCell = [p];
    }

    // If only one node, don't wrap in array
    cells.push([
      titleEl,
      contentCell.length === 1 ? contentCell[0] : contentCell
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
