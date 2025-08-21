/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the root accordion block (can be .accordion, or just .card for single item)
  let accordionRoot;
  if (element.classList.contains('accordion')) {
    accordionRoot = element;
  } else if (element.classList.contains('card')) {
    // single card treated as accordion of one
    accordionRoot = element;
  } else if (element.querySelector('.accordion')) {
    accordionRoot = element.querySelector('.accordion');
  } else {
    accordionRoot = element;
  }

  // 2. Gather all direct .card children (or treat a .card as a single-item accordion)
  let cards = [];
  if (accordionRoot.classList.contains('accordion')) {
    cards = Array.from(accordionRoot.querySelectorAll(':scope > .card'));
  } else if (accordionRoot.classList.contains('card')) {
    cards = [accordionRoot];
  }

  // 3. Build the table
  const rows = [];
  // Header row, exactly as specified
  rows.push(['Accordion (accordion3)']);

  // 4. For each .card extract title and body
  cards.forEach(card => {
    // Title: from .card-header h2, or fallback to .card-header text
    let titleElem = null;
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        // Use h2 directly, not just text, to preserve any formatting
        titleElem = h2;
      } else {
        // Use header element itself if no h2
        titleElem = header;
      }
    } else {
      // Fallback: create a span with card's textContent
      titleElem = document.createElement('span');
      titleElem.textContent = card.textContent.trim();
    }

    // Content: .card-body if present, or actual collapse section, else card itself
    let contentElem = card.querySelector('.card-body');
    if (!contentElem) {
      const collapse = card.querySelector('.collapse');
      if (collapse) {
        contentElem = collapse;
      } else {
        contentElem = card;
      }
    }

    rows.push([titleElem, contentElem]);
  });

  // 5. Build the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the accordion block (or single card) with the new table
  accordionRoot.replaceWith(table);
}
