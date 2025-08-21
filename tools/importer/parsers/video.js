export default function handleVideo(document) {
    const iframes = document.querySelectorAll('iframe');
    if (iframes) {
        iframes.forEach((iframe) => {
            const cells = [['Embed']];
            const iframeSrc = iframe.src;
            if (iframeSrc && (iframeSrc.includes('youtube') || iframeSrc?.includes('youtu.be'))) {
                // Wrap the iframe source in an anchor tag without target and rel attributes
                const link = `<a href="${iframeSrc}">${iframeSrc}</a>`;
                cells.push([link]);
                const table = WebImporter.DOMUtils.createTable(cells, document);
                iframe.replaceWith(table);
            }
        });
    }
}