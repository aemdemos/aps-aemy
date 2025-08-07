/* global WebImporter */
export default function parse(element, { document }) {
  // Get the list of card items
  const cardsList = element.querySelector('.cards__list');
  if (!cardsList) return;
  const cards = Array.from(cardsList.children);

  // Header row
  const rows = [ ['Cards (cards13)'] ];

  cards.forEach((card) => {
    // First cell: Image
    let imgCell = null;
    const itemImage = card.querySelector('.item-image');
    if (itemImage) {
      // Extract background-image url
      const style = itemImage.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1].trim();
        // Alt from card title
        const itemContent = card.querySelector('.item-content');
        const h3 = itemContent?.querySelector('h3');
        img.alt = h3 ? h3.textContent.trim() : 'card image';
        imgCell = img;
      }
    }

    // Second cell: Title, Description, CTA link
    const textCellParts = [];
    const itemContent = card.querySelector('.item-content');
    if (itemContent) {
      // Title
      const h3 = itemContent.querySelector('h3');
      if (h3) {
        // Use <strong> for title (no heading in markdown example)
        const strong = document.createElement('strong');
        strong.textContent = h3.textContent.trim();
        textCellParts.push(strong);
      }
      // Description (if not empty)
      const desc = itemContent.querySelector('p');
      if (desc && desc.textContent.trim()) {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent.trim();
        textCellParts.push(descP);
      }
      // CTA link
      const cta = itemContent.querySelector('a');
      if (cta) {
        const ctaA = cta; // reference the actual element
        textCellParts.push(ctaA);
      }
    }

    rows.push([imgCell, textCellParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
