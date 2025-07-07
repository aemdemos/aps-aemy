/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .cards.block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card items (li)
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  const rows = [];

  // Header: block name exactly as in the markdown example
  rows.push(['Cards']);

  // For each card, extract first image/icon and all text content
  cardItems.forEach((li) => {
    // IMAGE CELL
    let imgCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      // Use the <picture> element if present, else the <img>
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // TEXT CELL
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Reference the bodyDiv directly for resilience (includes strong, p, etc)
      textCell = bodyDiv;
    }

    // Only add row if at least one of image/text is present
    if (imgCell || textCell) {
      rows.push([imgCell, textCell]);
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
