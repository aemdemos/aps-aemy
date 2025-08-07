/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name (no extra Section Metadata block)
  const headerRow = ['Cards (cards32)'];
  const rows = [headerRow];

  // Each card is a direct child <div> of the main container
  const cards = element.querySelectorAll(':scope > div');

  cards.forEach((card) => {
    // ICON/IMAGE CELL (first cell)
    // Use the <i> as the visual, and append the number in bold for visual parity
    const icon = card.querySelector('i');
    const stat = card.querySelector('.cartfig');

    let iconCell = document.createElement('div');
    if (icon) {
      iconCell.appendChild(icon);
    }
    if (stat) {
      const statBlock = document.createElement('div');
      statBlock.style.fontWeight = 'bold';
      statBlock.style.fontSize = '1.25em';
      statBlock.appendChild(stat);
      iconCell.appendChild(statBlock);
    }

    // CONTENT CELL (second cell)
    // Place stat as heading (bold), then p as description
    const contentWrapper = document.createElement('div');
    if (stat) {
      const strong = document.createElement('strong');
      strong.textContent = stat.textContent;
      contentWrapper.appendChild(strong);
      contentWrapper.appendChild(document.createElement('br'));
    }
    const p = card.querySelector('p');
    if (p) {
      contentWrapper.appendChild(p);
    }

    rows.push([iconCell, contentWrapper]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
