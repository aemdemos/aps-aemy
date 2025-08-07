/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(el, className) {
    return Array.from(el.children).find(child => child.classList.contains(className));
  }

  // 1. Get the accordion item title
  let title = '';
  const headerDiv = getDirectChildByClass(element, 'card-header');
  if (headerDiv) {
    // Prefer heading if present
    const heading = headerDiv.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      title = heading.textContent.trim();
    } else {
      title = headerDiv.textContent.trim();
    }
  }

  // 2. Get the accordion content (all content inside the card-body)
  let contentCell = '';
  const collapseDiv = getDirectChildByClass(element, 'collapse');
  if (collapseDiv) {
    const cardBody = getDirectChildByClass(collapseDiv, 'card-body');
    if (cardBody) {
      // Use the card-body as the content (preserve all markup/structure)
      contentCell = cardBody;
    } else {
      // fallback: use all children of collapseDiv
      const frag = document.createDocumentFragment();
      Array.from(collapseDiv.childNodes).forEach(child => frag.appendChild(child));
      contentCell = frag;
    }
  }

  // 3. Compose the table rows
  const tableRows = [
    ['Accordion (accordion2)'],
    [title, contentCell]
  ];

  // 4. Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
