/* global WebImporter */
export default function parse(element, { document }) {
  // Find both columns: left and right
  const firstCol = element.querySelector('.code_snippet_first');
  const secondCol = element.querySelector('.code_snippet_second');

  // Helper to wrap elements in a div
  function wrapElements(elements) {
    const div = document.createElement('div');
    elements.forEach(e => div.append(e));
    return div;
  }

  // Handle the left column: "Today's Hours"
  let leftParts = [];
  if (firstCol) {
    // Heading (with icon)
    const heading = firstCol.querySelector('h2.snippet');
    if (heading) leftParts.push(heading);

    // Tabs area (contains both hours tables)
    const pcTab = firstCol.querySelector('.pc-tab');
    if (pcTab) {
      // Get the tabs content
      const section = pcTab.querySelector('section');
      if (section) {
        // tab1 (Today's Hours)
        const tab1 = section.querySelector('.tab1');
        if (tab1) leftParts.push(tab1);
        // tab2 (WSU Community Hours)
        const tab2 = section.querySelector('.tab2');
        if (tab2) leftParts.push(tab2);
      }
    }
  }
  const leftCell = wrapElements(leftParts);

  // Handle the right column: "Online Librarian"
  let rightParts = [];
  if (secondCol) {
    // Heading (with icon)
    const heading = secondCol.querySelector('h2.snippet');
    if (heading) rightParts.push(heading);
    // Chat widget area
    const chatRegion = secondCol.querySelector('[role="region"][aria-label="Chat Widget"]');
    if (chatRegion) {
      // If there's an iframe, replace with a link (not the iframe element itself)
      const iframe = chatRegion.querySelector('iframe');
      if (iframe && iframe.src) {
        const chatLink = document.createElement('a');
        chatLink.href = iframe.src;
        chatLink.textContent = 'Chat Widget';
        chatLink.target = '_blank';
        rightParts.push(chatLink);
      }
    }
  }
  const rightCell = wrapElements(rightParts);

  // Table header must exactly match: Columns (columns31)
  const headerRow = ['Columns (columns31)'];
  // Second row: two columns
  const contentRow = [leftCell, rightCell];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
