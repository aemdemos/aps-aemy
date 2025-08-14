/* global WebImporter */
export default function parse(element, { document }) {
    // Get all immediate child divs (these are the columns)
    const colWrappers = Array.from(element.children).filter(e => e.tagName === 'DIV');
    if (colWrappers.length !== 2) return;

    // Helper: Recursively replace iframes (not images) with links, in-place, referencing existing elements
    function replaceIframesWithLinks(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // If it's an iframe (not image), replace with link
            if (node.tagName === 'IFRAME') {
                const src = node.getAttribute('src');
                if (src) {
                    const a = document.createElement('a');
                    a.href = src;
                    a.textContent = src;
                    return a;
                }
                // If somehow no src, remove
                return document.createTextNode('');
            }
            // Otherwise, recursively process its children
            const children = Array.from(node.childNodes).map(replaceIframesWithLinks);
            // Remove all childNodes and append processed
            while (node.firstChild) node.removeChild(node.firstChild);
            children.forEach(child => node.appendChild(child));
            return node;
        }
        // Text nodes remain as-is
        return node;
    }

    // For each column, replace iframes with links in-place (referencing original elements, not clones)
    replaceIframesWithLinks(colWrappers[0]);
    replaceIframesWithLinks(colWrappers[1]);

    // Compose the table
    const cells = [
        ['Columns (columns31)'],
        [colWrappers[0], colWrappers[1]]
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
}
