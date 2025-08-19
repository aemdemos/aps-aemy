/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block table
  const headerRow = ['Events'];

  // Collect event rows
  const contentRows = Array.from(element.querySelectorAll('.s-lc-w-dtr')).map(row => {
    // Date info
    const dateDiv = row.querySelector('.s-lc-w-date');
    const month = dateDiv?.querySelector('.s-lc-w-date-m')?.textContent?.trim() || '';
    const day = dateDiv?.querySelector('.s-lc-w-date-d')?.textContent?.trim() || '';
    const time = dateDiv?.querySelector('.s-lc-w-date-t')?.textContent?.trim() || '';
    const dateCell = document.createElement('div');
    dateCell.textContent = `${month} ${day} ${time}`.trim();

    // Title, location, and links (all as text)
    const titleText = row.querySelector('.s-lc-w-title')?.textContent.trim() || '';
    const locationText = row.querySelector('.s-lc-w-loc')?.textContent.trim() || '';

    const linksDiv = document.createElement('div');
    row.querySelectorAll('a').forEach(a => {
      const link = document.createElement('a');
      link.href = a.href;
      link.target = '_blank';
      link.textContent = a.textContent.trim();
      linksDiv.appendChild(link);
      linksDiv.appendChild(document.createTextNode(' '));
    });

    const contentCell = document.createElement('div');

    [titleText, locationText].forEach(text => {
      if (text) {
        const div = document.createElement('div');
        div.textContent = text;
        contentCell.appendChild(div);
      }
    });
    contentCell.appendChild(linksDiv);

    return [dateCell, contentCell];
  });

  // Build table and replace element
  const table = WebImporter.DOMUtils.createTable([headerRow, ...contentRows], document);
  element.replaceWith(table);
}