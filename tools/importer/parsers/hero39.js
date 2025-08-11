/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: Must match the example exactly
  const headerRow = ['Hero (hero39)'];

  // 2. Extract background image from inline style, if present
  let imgEl = null;
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background\s*:\s*url\(['"]?([^'")]+)['"]?/);
  if (bgMatch && bgMatch[1]) {
    imgEl = document.createElement('img');
    imgEl.src = bgMatch[1];
    imgEl.alt = '';
  }

  // 3. Extract all direct text and content (desc wrapper)
  // Flexible: If no .home-banner__desc-wrapper, take all direct text nodes and child elements
  let textBlockElements = [];
  const children = Array.from(element.children);
  let foundDesc = false;
  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.contains('home-banner__desc-wrapper')) {
      foundDesc = true;
      // Use its full content for the text cell
      textBlockElements.push(children[i]);
    }
  }
  if (!foundDesc) {
    // Fall back: get all direct child nodes that are not <img>
    children.forEach((child) => {
      if (child.tagName !== 'IMG') textBlockElements.push(child);
    });
    // Also include direct text nodes (not children)
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textBlockElements.push(span);
      }
    }
  }

  // 4. Add CTA link if the element itself is an <a> with href
  if (element.tagName === 'A' && element.getAttribute('href')) {
    // If not already present in textBlockElements, add a CTA link at end
    const ctaLink = document.createElement('a');
    ctaLink.href = element.getAttribute('href');
    // Use text from desc if possible, else fallback to href
    let linkText = '';
    if (foundDesc) {
      const desc = element.querySelector('.home-banner__desc');
      linkText = desc ? desc.textContent.trim() : element.getAttribute('href');
    } else {
      linkText = element.textContent.trim() || element.getAttribute('href');
    }
    ctaLink.textContent = linkText;
    // Only add if not duplicated
    if (!textBlockElements.some(el => el.textContent && el.textContent.trim() === linkText)) {
      textBlockElements.push(document.createElement('br'));
      textBlockElements.push(ctaLink);
    }
  }

  // 5. Build the rows as per spec: 1 column, 3 rows
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''],
    [textBlockElements.length ? textBlockElements : '']
  ];

  // 6. Create the table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
