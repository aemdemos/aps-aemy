/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul class="cards__list">
  const ul = element.querySelector('ul.cards__list');
  if (!ul) return;

  const cards = Array.from(ul.querySelectorAll(':scope > li.cards__item'));
  const tableRows = [];
  // Header row (must match example exactly)
  tableRows.push(['Cards (cards13)']);

  cards.forEach(card => {
    const wrapper = card.querySelector('.item-wrapper');
    // 1. IMAGE: get background image from <a.item-image>
    const imageLink = wrapper.querySelector('.item-image');
    let imgEl = null;
    if (imageLink) {
      const style = imageLink.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1].trim();
        // Use the title as alt text if available
        const title = wrapper.querySelector('.item-content__title');
        imgEl.alt = title ? title.textContent.trim() : '';
      }
    }
    // 2. TEXT AREA
    const contentDiv = wrapper.querySelector('.item-content');
    const textContent = [];
    // Title as <strong> (semantics: bold, since source is h3 but design is title)
    const heading = contentDiv.querySelector('.item-content__title');
    if (heading && heading.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      textContent.push(strong);
    }
    // Description: only add if non-empty
    const desc = contentDiv.querySelector('.item-content__desc');
    if (desc && desc.textContent.trim()) {
      // Put on a new line
      textContent.push(document.createElement('br'));
      textContent.push(desc);
    }
    // CTA link: only if present
    const cta = contentDiv.querySelector('.item-content__link');
    if (cta) {
      // Add a line break only if there's a title or description
      if (textContent.length > 0) textContent.push(document.createElement('br'));
      textContent.push(cta);
    }
    // Remove leading/trailing <br> (if any)
    while (textContent.length && textContent[0].tagName === 'BR') textContent.shift();
    while (textContent.length && textContent[textContent.length-1].tagName === 'BR') textContent.pop();
    tableRows.push([
      imgEl,
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
