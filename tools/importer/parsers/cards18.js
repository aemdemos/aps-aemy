/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have exactly one column: ['Cards (cards18)']
  const headerRow = ['Cards (cards18)'];

  // Each card div is a direct child
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  const rows = cards.map(card => {
    // First cell: the icon
    const icon = card.querySelector('i');
    // Second cell: all other content except the icon
    const textNodes = [];
    card.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'i') return;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
      textNodes.push(node);
    });
    let textCell;
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else {
      textCell = textNodes;
    }
    return [icon, textCell];
  });

  // Compose table: header row is one column, all following rows are two columns
  // So table data is: [[header], [icon, text], [icon, text], ...]
  const tableCells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
