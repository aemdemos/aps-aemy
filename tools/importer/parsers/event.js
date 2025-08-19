/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for block table
  const headerRow = ['Events'];

 // 2. Extract accordion title from .card-header
  let titleCell;
  let eventTable = element.querySelector(':scope > table.s-lc-w-table');

  if (eventTable.length === 0 && element.classList.contains('s-lc-w-table')) {
    eventTable = [element];
  }

  // 3. Collect event rows
  const contentRows = [];
  const rows = element.querySelectorAll('.s-lc-w-dtr');
  rows.forEach(row => {
    // Date info
    const dateDiv = row.querySelector('.s-lc-w-date');
    const month = dateDiv?.querySelector('.s-lc-w-date-m')?.textContent?.trim() || '';
    const day = dateDiv?.querySelector('.s-lc-w-date-d')?.textContent?.trim() || '';
    const time = dateDiv?.querySelector('.s-lc-w-date-t')?.textContent?.trim() || '';
    const dateCell = document.createElement('div');
    dateCell.textContent = `${month} ${day} ${time}`.trim();

    // Title
    const titleDiv = row.querySelector('.s-lc-w-title');
    const titleCell = titleDiv ? titleDiv.cloneNode(true) : document.createElement('span');

    // Location
    const locDiv = row.querySelector('.s-lc-w-loc');
    const locationCell = locDiv ? locDiv.cloneNode(true) : document.createElement('span');

    // Links
    const linksDiv = document.createElement('div');
    row.querySelectorAll('a').forEach(a => {
      linksDiv.appendChild(a.cloneNode(true));
      linksDiv.appendChild(document.createTextNode(' '));
    });

    contentRows.push([dateCell, titleCell, locationCell, linksDiv]);
  });

  // 4. Build DA table
  const cells = [headerRow, ...contentRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}