/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block name
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Support for both single accordion and multi-accordion wrapper
  const cards = element.classList.contains('card') && !element.querySelector(':scope > .card')
    ? [element]
    : Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach(card => {
    // Dynamically extract title cell
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      // Use the first heading element, else all text content
      const heading = header.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleCell = heading;
      } else {
        // If no heading, use all children or just the header
        titleCell = header.childNodes.length > 0 ? Array.from(header.childNodes) : header;
      }
    }
    // Dynamically extract content cell
    let contentCell = '';
    // Find .collapse block for content
    const collapse = card.querySelector('.collapse');
    let bodyRoot = null;
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      bodyRoot = body ? body : collapse;
    } else {
      // Fallback: the card itself, if no collapse
      bodyRoot = card;
    }
    // Gather all meaningful content inside bodyRoot
    if (bodyRoot) {
      // Gather all block-level content (preserving semantic structure)
      let content = [];
      Array.from(bodyRoot.childNodes).forEach(node => {
        // skip whitespace text nodes at the top level
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        content.push(node);
      });
      // If only one item, just use that element; otherwise, pass array
      contentCell = content.length === 1 ? content[0] : content;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
