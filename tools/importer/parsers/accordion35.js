/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified in the example
  const headerRow = ['Accordion (accordion35)'];

  // Collect all accordion items (cards)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  const rows = [headerRow];

  cards.forEach(card => {
    // Find the title: look for first heading in .card-header, fallback to textContent
    let titleElem = card.querySelector('.card-header h1, .card-header h2, .card-header h3, .card-header h4, .card-header h5, .card-header h6');
    if (!titleElem) {
      const cardHeader = card.querySelector('.card-header');
      if (cardHeader) {
        // create a paragraph element for the header text if no heading present (referencing existing element)
        const p = document.createElement('p');
        p.textContent = cardHeader.textContent.trim();
        titleElem = p;
      }
    }
    // Find the card-body
    const contentElem = card.querySelector('.card-body');
    if (titleElem && contentElem) {
      rows.push([titleElem, contentElem]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
