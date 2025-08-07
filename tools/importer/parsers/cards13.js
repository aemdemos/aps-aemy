/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in the example
  const cells = [['Cards (cards13)']];

  // Get all card items from the direct list (should be robust to class or structure variations)
  const list = element.querySelector('ul');
  if (!list) return;

  list.querySelectorAll(':scope > li').forEach((item) => {
    // --- COLUMN 1: Image ---
    let imgEl = null;
    // Find an element with a background image
    const imgLink = item.querySelector('[style*="background-image"]');
    if (imgLink && imgLink.style && imgLink.style.backgroundImage) {
      const match = imgLink.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        // Use card's heading as alt if present
        const heading = item.querySelector('h3, .item-content__title');
        imgEl.alt = heading ? heading.textContent.trim() : '';
      }
    }

    // --- COLUMN 2: Text content ---
    // We will combine all text (title, description, link) as in the example
    const content = item.querySelector('.item-content');
    const col2 = document.createElement('div');

    if (content) {
      // Title (strong)
      const title = content.querySelector('h3, .item-content__title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        col2.appendChild(strong);
      }

      // Description (if present)
      const desc = content.querySelector('p, .item-content__desc');
      if (desc && desc.textContent.trim()) {
        if (col2.childNodes.length > 0) col2.appendChild(document.createElement('br'));
        col2.appendChild(document.createTextNode(desc.textContent.trim()));
      }

      // CTA (if present)
      const link = content.querySelector('a');
      if (link) {
        if (col2.childNodes.length > 0) col2.appendChild(document.createElement('br'));
        col2.appendChild(link);
      }
    }

    // If for some reason .item-content is missing, try to get any heading and CTA
    if (!content) {
      const title = item.querySelector('h3');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        col2.appendChild(strong);
      }
      const desc = item.querySelector('p');
      if (desc && desc.textContent.trim()) {
        if (col2.childNodes.length > 0) col2.appendChild(document.createElement('br'));
        col2.appendChild(document.createTextNode(desc.textContent.trim()));
      }
      const link = item.querySelector('a');
      if (link) {
        if (col2.childNodes.length > 0) col2.appendChild(document.createElement('br'));
        col2.appendChild(link);
      }
    }

    cells.push([imgEl, col2]);
  });

  // Build and replace the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
