/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left and right columns
  const leftCol = element.querySelector('.media-body');
  const rightCol = element.querySelector('.media-right');

  // 1. LEFT COLUMN CONTENT
  // a. Title (h3 > a)
  const h3 = leftCol.querySelector('.media-heading');
  // Use the heading from h3, referencing the original element
  // b. Description paragraphs
  const descDiv = leftCol.querySelector('.s-lc-c-evt-des');
  // All paragraphs in description
  const descParas = Array.from(descDiv ? descDiv.children : []);
  // c. Details (<dl>)
  const detailsDl = leftCol.querySelector('dl');
  let detailsList = null;
  if (detailsDl) {
    // For each dt/dd pair, create a <li><strong>dt</strong> dd/link</li>
    const list = document.createElement('ul');
    const nodes = Array.from(detailsDl.children);
    for (let i = 0; i < nodes.length - 1; i += 2) {
      const dt = nodes[i];
      const dd = nodes[i+1];
      if (dt.tagName.toLowerCase() === 'dt' && dd.tagName.toLowerCase() === 'dd') {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = dt.textContent.trim();
        li.appendChild(strong);
        li.append(' ');
        if (dd.querySelector('a')) {
          li.appendChild(dd.querySelector('a'));
        } else {
          li.append(dd.textContent.trim());
        }
        list.appendChild(li);
      }
    }
    detailsList = list;
  }

  // Assemble all left column content as a single cell (array of elements)
  const leftContent = [];
  if (h3) leftContent.push(h3);
  descParas.forEach(p => leftContent.push(p));
  if (detailsList) leftContent.push(detailsList);

  // 2. RIGHT COLUMN CONTENT
  // Reference the original image element
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
  }

  // 3. Table header row
  const headerRow = ['Columns (columns33)'];

  // 4. Assemble table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // 5. Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
