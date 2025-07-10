/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to convert iframe (non-image) to link
  function iframeToLink(iframe) {
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = 'Chat Widget';
    a.target = '_blank';
    return a;
  }

  // Get the two major columns in the block
  const children = Array.from(element.querySelectorAll(':scope > div'));
  const first = children.find(div => div.classList.contains('code_snippet_first'));
  const second = children.find(div => div.classList.contains('code_snippet_second'));

  // Gather left column content (Today's Hours)
  let leftColContent = [];
  if (first) {
    const h2 = first.querySelector('h2');
    if (h2) leftColContent.push(h2);
    const pcTab = first.querySelector('.pc-tab');
    if (pcTab) leftColContent.push(pcTab);
  }

  // Gather right column content (Online Librarian)
  let rightColContent = [];
  if (second) {
    const h2 = second.querySelector('h2');
    if (h2) rightColContent.push(h2);
    const chatRegion = second.querySelector('[role="region"]');
    if (chatRegion) {
      const iframe = chatRegion.querySelector('iframe');
      if (iframe) {
        rightColContent.push(iframeToLink(iframe));
      } else {
        rightColContent.push(chatRegion);
      }
    }
  }

  // Fix: header row should have the same number of columns as content row
  const tableRows = [
    ['Columns', ''],
    [leftColContent, rightColContent]
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
