/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the required block name and variant
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Query all cards
  const cardItems = element.querySelectorAll('.cards__item');

  cardItems.forEach((card) => {
    // First cell: Image (from background-image on <a>)
    const imageLink = card.querySelector('.item-image');
    let imgEl = null;
    if (imageLink) {
      const bgStyle = imageLink.getAttribute('style') || '';
      const match = bgStyle.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        imgEl.alt = imageLink.getAttribute('alt') || '';
      }
    }

    // Second cell: Text content (Heading, description, CTA)
    const contentDiv = card.querySelector('.item-content');
    const textCellContent = [];
    if (contentDiv) {
      const title = contentDiv.querySelector('.item-content__title');
      if (title) {
        // Use <strong> to visually denote heading, as in example screenshot
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCellContent.push(strong);
      }
      const desc = contentDiv.querySelector('.item-content__desc');
      if (desc && desc.textContent.trim().length) {
        textCellContent.push(document.createElement('br'));
        // Reference the existing paragraph for description, keep semantic <p>
        textCellContent.push(desc);
      }
      const cta = contentDiv.querySelector('.item-content__link');
      if (cta) {
        textCellContent.push(document.createElement('br'));
        // Reference the existing link for CTA
        textCellContent.push(cta);
      }
    }

    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
