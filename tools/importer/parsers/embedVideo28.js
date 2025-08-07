/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all content inside the element (including text nodes)
  const nodes = Array.from(element.childNodes);

  // Find the first iframe (should only be one for an Embed block)
  const iframe = nodes.find(n => n.nodeType === 1 && n.tagName === 'IFRAME');

  // Prepare a link to the iframe src if present
  let link = null;
  if (iframe && iframe.src) {
    link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
  }

  // Gather all content except the iframe (preserving text, possible extra text, or html)
  const preIframeNodes = nodes.filter(n => !(n.nodeType === 1 && n.tagName === 'IFRAME'));

  // Compose cell content: any pre-iframe nodes (text, html), then the link if present
  // If there is only the iframe, cell content is just the link
  let content = [];
  if (preIframeNodes.length > 0) {
    content = preIframeNodes;
  }
  if (link) {
    content.push(link);
  }
  if (content.length === 0) {
    content = [''];
  }

  const cells = [
    ['Embed'],
    [content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}