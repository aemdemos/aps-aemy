/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matching example
  const headerRow = ['Cards (cards18)'];
  const rows = [];
  // Get each card in container
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach((cardDiv) => {
    // First cell: Icon (element)
    const icon = cardDiv.querySelector('i');
    // Second cell: Text content
    const count = cardDiv.querySelector('.cartfig');
    const type = cardDiv.querySelector('p');
    // Compose text cell
    // Use <div>: <strong>count</strong><br />type (as normal text)
    const textCell = document.createElement('div');
    if (count) {
      const strong = document.createElement('strong');
      strong.textContent = count.textContent;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    if (type) {
      textCell.appendChild(document.createTextNode(type.textContent));
    }
    rows.push([icon, textCell]);
  });
  // Build table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
