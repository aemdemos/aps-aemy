/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Accordion (accordion12)'];

  // Get the title from the .card-header (find heading or fallback to text)
  let titleCell = '';
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // If no heading, use textContent (wrap in <span> to allow element reference)
      const span = document.createElement('span');
      span.textContent = headerDiv.textContent.trim();
      titleCell = span;
    }
  }

  // Get the content from .collapse > .card-body (reference existing element)
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const body = collapseDiv.querySelector('.card-body');
    if (body) {
      contentCell = body;
    } else {
      // fallback: whole collapse contents
      contentCell = collapseDiv;
    }
  }

  // Compose rows: header, then [title, content]
  const rows = [headerRow, [titleCell, contentCell]];

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
