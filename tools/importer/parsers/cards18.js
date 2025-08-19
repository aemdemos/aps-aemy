/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards18)'];
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];

  cardDivs.forEach(card => {
    // First cell: icon (use existing <i> element)
    const icon = card.querySelector('i');
    // Second cell: number (in <span class="cartfig">) and label (in <p>)
    const fig = card.querySelector('.cartfig');
    const p = card.querySelector('p');
    // Combine number (bold) and label (p)
    const contentDiv = document.createElement('div');
    if (fig) contentDiv.appendChild(fig);
    if (p) {
      if (fig) contentDiv.appendChild(document.createElement('br'));
      contentDiv.appendChild(p);
    }
    rows.push([icon, contentDiv]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
