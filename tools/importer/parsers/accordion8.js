/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as in the example
  const cells = [
    ['Accordion (accordion8)'],
  ];

  // Get all immediate child .card elements (each is an accordion item)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach((card) => {
    // --- TITLE CELL ---
    // The card-header contains the clickable title (usually an <h2> inside)
    let titleCell = '';
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      // Prefer a heading if present, else fall back to header's full content
      const heading = cardHeader.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleCell = heading;
      } else {
        // Use header's entire element as fallback
        titleCell = cardHeader;
      }
    }

    // --- CONTENT CELL ---
    // The card-body contains the content (text, lists, iframes, etc)
    let contentCell = '';
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      // We'll build an array of elements (not their HTML!) to reference directly
      const contentNodes = [];
      for (const node of cardBody.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // For <iframe> elements that are not inside <img>, convert to <a href=src>
          if (node.tagName === 'IFRAME') {
            const src = node.getAttribute('src');
            if (src) {
              const a = document.createElement('a');
              a.href = src;
              a.textContent = src;
              contentNodes.push(a);
              continue;
            }
          }
          // For <p> containing <iframe>
          if (node.tagName === 'P' && node.querySelector('iframe')) {
            const iframe = node.querySelector('iframe');
            if (iframe) {
              const src = iframe.getAttribute('src');
              if (src) {
                const a = document.createElement('a');
                a.href = src;
                a.textContent = src;
                contentNodes.push(a);
                // Also check for text content remaining in the <p> outside <iframe>
                const temp = node.cloneNode(true);
                temp.querySelector('iframe').remove();
                if (temp.textContent.trim()) {
                  // If there's additional text, keep it as a <p>
                  const p = document.createElement('p');
                  p.innerHTML = temp.innerHTML.trim();
                  contentNodes.push(p);
                }
                continue;
              }
            }
          }
          // Otherwise, keep the element as is
          contentNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap in a <span> for text nodes, though this rarely occurs directly
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          contentNodes.push(span);
        }
      }
      // If no elements, leave contentCell as ''
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = '';
      }
    }

    cells.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
