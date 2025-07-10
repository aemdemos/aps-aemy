/* global WebImporter */
export default function parse(element, { document }) {
  // For the given HTML, we want to extract all visible text content from the block,
  // and organize it into a single cell under the 'Embed' header.
  // There is no Section Metadata in the example, so don't include one.
  // Only one table, with header 'Embed', exactly as in the example.

  // To avoid missing any text, flatten all text nodes in the element
  function extractTextContent(el) {
    let text = '';
    // Only consider elements and text nodes
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Don't include script/style tags
        if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
          text += extractTextContent(node);
        }
      }
    });
    return text;
  }

  const textContent = extractTextContent(element).replace(/\s+/g, ' ').trim();
  const cellContent = textContent ? textContent : '';

  // Table structure: header row, then content row with all the text.
  const cells = [
    ['Embed'],
    [cellContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
