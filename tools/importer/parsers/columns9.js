/* global WebImporter */
export default function parse(element, { document }) {
  // Extract columns from links in the first <p> element
  const p = element.querySelector('p');
  let columns = [];
  if (p) {
    columns = Array.from(p.querySelectorAll('a'));
  }
  if (columns.length === 0) {
    columns = [''];
  }

  // Create the table manually so that the header cell gets the correct colspan
  const table = document.createElement('table');
  // Header row
  const trHead = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns9)';
  th.setAttribute('colspan', columns.length);
  trHead.appendChild(th);
  table.appendChild(trHead);
  // Content row
  const trContent = document.createElement('tr');
  columns.forEach(col => {
    const td = document.createElement('td');
    td.append(col);
    trContent.appendChild(td);
  });
  table.appendChild(trContent);

  element.replaceWith(table);
}