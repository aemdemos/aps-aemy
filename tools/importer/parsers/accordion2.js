/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block table: 2 columns, first row is block name, each row is [title, content]
  const headerRow = ['Accordion (accordion2)'];
  const rows = [headerRow];

  // There may be multiple accordion items, but in this HTML, it's a single .card
  // Title: in .card-header > h2/h3/h4/h5/h6 or .card-header
  let titleElem = element.querySelector('.card-header h2, .card-header h3, .card-header h4, .card-header h5, .card-header h6');
  if (!titleElem) {
    titleElem = element.querySelector('.card-header');
  }
  // Use the existing element (not clone/innerHTML)

  // Content: in .collapse > .card-body
  let contentElem = element.querySelector('.collapse > .card-body');
  if (!contentElem) {
    contentElem = element.querySelector('.collapse');
    // fallback: if still not found
    if (!contentElem) {
      contentElem = element.querySelector('.card-body') || document.createElement('div');
    }
  }

  // The card-body contains all the accordion content; reference directly.
  rows.push([titleElem, contentElem]);

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
