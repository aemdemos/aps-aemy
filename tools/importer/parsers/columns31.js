/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Safely get list of immediate children for columns, fallback if class structure changes
  let leftCol, rightCol;
  leftCol = element.querySelector('.code_snippet_first') || element.children[0];
  rightCol = element.querySelector('.code_snippet_second') || element.children[1];

  // Header row matches the block name from instructions and example
  const headerRow = ['Columns (columns31)'];

  // LEFT COLUMN: Today's Hours (all content relevant to library hours)
  const leftCellNodes = [];
  if (leftCol) {
    // Heading (keep semantic <h2>)
    const h2 = leftCol.querySelector('h2');
    if (h2) leftCellNodes.push(h2);

    // Full tabbed block (all nested content)
    const pcTab = leftCol.querySelector('.pc-tab');
    if (pcTab) {
      leftCellNodes.push(pcTab);
    }

    // If there's an extra viewhours span outside .pc-tab, include it (avoid duplication)
    const viewhours = leftCol.querySelector('.viewhours');
    if (viewhours && (!pcTab || !pcTab.contains(viewhours))) {
      leftCellNodes.push(viewhours);
    }
  }

  // RIGHT COLUMN: Online Librarian
  const rightCellNodes = [];
  if (rightCol) {
    // Heading (keep semantic <h2>)
    const h2 = rightCol.querySelector('h2');
    if (h2) rightCellNodes.push(h2);

    // Chat widget - convert iframe to link per requirements
    const chatWidget = rightCol.querySelector('[role="region"][aria-label="Chat Widget"]');
    if (chatWidget) {
      const iframe = chatWidget.querySelector('iframe[src]');
      if (iframe) {
        const link = document.createElement('a');
        link.href = iframe.src;
        link.textContent = 'Open Online Librarian Chat';
        link.target = '_blank';
        rightCellNodes.push(link);
      }
    }
  }

  // Compose the table: header row, then content row as columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCellNodes, rightCellNodes]
  ], document);

  // Replace the original element with our table
  element.replaceWith(table);
}
