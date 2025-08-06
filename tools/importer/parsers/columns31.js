/* global WebImporter */
export default function parse(element, { document }) {
  // Collect the two column divs
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return; // Defensive: expect only 2 columns

  // FIRST COLUMN: Today's Hours (tab UI)
  // Grab header and the whole pc-tab (includes tab labels + content)
  const firstHeader = columns[0].querySelector('h2.snippet');
  const pcTab = columns[0].querySelector('.pc-tab');
  const col1Content = [];
  if (firstHeader) col1Content.push(firstHeader);
  if (pcTab) col1Content.push(pcTab);

  // SECOND COLUMN: Online Librarian
  // Grab header
  const secondHeader = columns[1].querySelector('h2.snippet');
  // Grab chat region (which contains iframe)
  const chatRegion = columns[1].querySelector('[role="region"]');
  let chatLink = null;
  if (chatRegion) {
    const iframe = chatRegion.querySelector('iframe');
    if (iframe && iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = 'Open chat widget';
      a.target = '_blank';
      chatLink = a;
    }
  }
  const col2Content = [];
  if (secondHeader) col2Content.push(secondHeader);
  if (chatRegion) {
    if (chatLink) {
      col2Content.push(chatLink);
    } else {
      col2Content.push(chatRegion);
    }
  }

  // Table structure: header row, then content row with both columns
  const headerRow = ['Columns (columns31)'];
  const cells = [headerRow, [col1Content, col2Content]];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
