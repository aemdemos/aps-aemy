/* global WebImporter */
export default function parse(element, { document }) {
  // Gather accordion items
  const cards = element.querySelectorAll(':scope > .card');
  // To ensure the header row is a single cell and all other rows have two columns
  const rows = [];
  // Header row as a single cell
  rows.push(['Accordion (accordion8)']);
  cards.forEach((card) => {
    // Title: get heading inside .card-header if exists, else use its text
    let titleElem;
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      const heading = cardHeader.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleElem = heading;
      } else {
        titleElem = document.createElement('span');
        titleElem.textContent = cardHeader.textContent.trim();
      }
    } else {
      titleElem = document.createElement('span');
    }
    // Content: from .card-body inside .collapse
    let contentElem = document.createElement('div');
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // Walk through children, replacing iframes not in anchors with links
        Array.from(cardBody.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.querySelector('iframe') && !node.querySelector('a')) {
            // Replace iframe (not in anchor) with a link
            const iframe = node.querySelector('iframe');
            if (iframe) {
              const link = document.createElement('a');
              link.href = iframe.src;
              link.textContent = iframe.src;
              contentElem.appendChild(link);
            }
          } else {
            contentElem.appendChild(node);
          }
        });
      }
    }
    rows.push([titleElem, contentElem]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
