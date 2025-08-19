/* global WebImporter */
export default function parse(element, { document }) {
  // Get both column wrappers
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const left = columns.find(div => div.classList.contains('code_snippet_first'));
  const right = columns.find(div => div.classList.contains('code_snippet_second'));

  // LEFT COLUMN CONTENT
  let leftContent = [];
  if (left) {
    // Heading
    const leftHeading = left.querySelector('h2');
    if (leftHeading) leftContent.push(leftHeading);
    // Tabbed content (nav and sections)
    const pcTab = left.querySelector('.pc-tab');
    if (pcTab) {
      const nav = pcTab.querySelector('nav');
      if (nav) leftContent.push(nav);
      const section = pcTab.querySelector('section');
      if (section) {
        Array.from(section.children).forEach(tab => leftContent.push(tab));
      }
    }
  }
  if (leftContent.length === 0) leftContent = [''];

  // RIGHT COLUMN CONTENT
  let rightContent = [];
  if (right) {
    // Heading
    const rightHeading = right.querySelector('h2');
    if (rightHeading) rightContent.push(rightHeading);
    // Find chat widget iframe and convert to link
    const chatRegion = right.querySelector('[role="region"]');
    if (chatRegion) {
      const chatIframe = chatRegion.querySelector('iframe');
      if (chatIframe) {
        const chatLink = document.createElement('a');
        chatLink.href = chatIframe.src;
        chatLink.textContent = 'Open Chat Widget';
        rightContent.push(chatLink);
      }
      // Optionally include additional chat info except iframe
      Array.from(chatRegion.childNodes).forEach(node => {
        if (!(node.tagName === 'IFRAME')) {
          rightContent.push(node);
        }
      });
    }
  }
  if (rightContent.length === 0) rightContent = [''];

  // Structure: header row is a one-cell array, then content row is two-cell array
  const table = [
    ['Columns (columns31)'],
    [leftContent, rightContent]
  ];

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
