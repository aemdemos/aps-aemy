/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const cells = [['Accordion (accordion8)']];

  // Each card is an accordion item
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Accordion title cell (try to keep heading element if present)
    let titleCell = '';
    const header = card.querySelector('.card-header');
    if (header) {
      // Use the first heading (h2-h6) if present, else the header div
      const heading = header.querySelector('h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        titleCell = header;
      }
    }

    // Accordion content cell
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      // Use the .card-body if present, else the whole collapse content
      const body = collapse.querySelector('.card-body');
      if (body) {
        // Replace any iframe (that is not inside img) with a link with href=src
        const iframes = body.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          // Check if iframe is inside a link, preserve wrapping link if present
          const linkParent = iframe.parentElement && iframe.parentElement.tagName === 'A' ? iframe.parentElement : null;
          if (!linkParent) {
            // Only replace iframes not inside an <a>
            const link = document.createElement('a');
            link.href = iframe.src;
            link.textContent = iframe.title || iframe.src;
            iframe.replaceWith(link);
          }
        });
        // Also, if an iframe is INSIDE an <a>, remove iframe and keep only the <a> (with its href and label)
        body.querySelectorAll('a').forEach(a => {
          // If the only child is an iframe, remove it (keep the link label if empty)
          if (a.children.length === 1 && a.firstElementChild.tagName === 'IFRAME') {
            a.innerHTML = a.href;
          }
        });
        contentCell = body;
      } else {
        contentCell = collapse;
      }
    }

    cells.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
