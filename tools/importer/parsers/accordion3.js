/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, exactly as in the example
  const headerRow = ['Accordion (accordion3)'];

  // Gather all .card elements, if any
  let cards = element.querySelectorAll(':scope > .card');
  // If no .card direct children and element itself is a card, treat it as the only card
  if (cards.length === 0 && element.classList.contains('card')) {
    cards = [element];
  }

  const rows = [];
  cards.forEach(card => {
    // Title cell: Extract visible header text
    let titleElem = card.querySelector('.card-header');
    let titleContent = '';
    if (titleElem) {
      // Use heading text if present, else full header text
      const heading = titleElem.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleContent = heading.textContent.trim();
      } else {
        titleContent = titleElem.textContent.trim();
      }
    } else {
      // fallback: first heading in card
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      titleContent = heading ? heading.textContent.trim() : '';
    }

    // Content cell: Find .collapse area (accordion content)
    let contentElem = null;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      // Use all .collapse children, preserve structure
      const children = Array.from(collapse.childNodes).filter(node => {
        // Exclude empty text nodes
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        return true;
      });
      if (children.length === 1) {
        contentElem = children[0];
      } else {
        contentElem = document.createElement('div');
        children.forEach(node => contentElem.appendChild(node));
      }
    } else {
      // fallback: everything except .card-header
      const contentNodes = Array.from(card.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('card-header')) return false;
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        return true;
      });
      if (contentNodes.length === 1) {
        contentElem = contentNodes[0];
      } else {
        contentElem = document.createElement('div');
        contentNodes.forEach(node => contentElem.appendChild(node));
      }
    }
    // Push row with title and content
    rows.push([titleContent, contentElem]);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
