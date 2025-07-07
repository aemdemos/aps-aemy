/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block inside the container
  const heroBlock = element.querySelector('.hero.block');
  
  // Find the innermost div that has the actual hero content
  let contentDiv;
  if (heroBlock) {
    // Usually .hero.block > div > div
    const possibleDivs = heroBlock.querySelectorAll('div');
    if (possibleDivs.length > 0) {
      contentDiv = possibleDivs[possibleDivs.length - 1];
    }
  }

  // Extract the image <p> if present
  let imagePara = null;
  if (contentDiv) {
    // Get all p tags that have a picture inside
    const pWithPicture = Array.from(contentDiv.querySelectorAll('p')).find(p => p.querySelector('picture'));
    if (pWithPicture) {
      imagePara = pWithPicture;
    }
  }

  // Extract the text content (heading, subheading, paragraphs, etc.)
  let textContent = [];
  if (contentDiv) {
    // We'll get all elements except those <p> with a picture
    const children = Array.from(contentDiv.children);
    for (const child of children) {
      if (child.tagName === 'P' && child.querySelector('picture')) {
        continue; // skip the image
      }
      // Add non-empty elements
      if (child.textContent.trim() !== '' || child.querySelector('*')) {
        textContent.push(child);
      }
    }
  }
  // If no text content, add an empty string as a fallback
  if (textContent.length === 0) textContent = [''];

  // Compose the table rows based on the block definition
  const rows = [];
  // 1. Header row with block name
  rows.push(['Hero']);
  // 2. Image row (may be empty)
  rows.push([imagePara ? imagePara : '']);
  // 3. Text content row (all heading, subheading, etc.)
  rows.push([textContent]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
