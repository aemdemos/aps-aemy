export default function handleVideo(document) {
    const iframes = document.querySelectorAll('iframe');
    if (iframes) {
        iframes.forEach((iframe) => {
          const cells = [['Embed']];
          const iframeSrc = iframe.src;
          if (iframeSrc && (iframeSrc.includes('youtube') || iframeSrc?.includes('youtu.be'))) {
            cells.push([iframeSrc]);
            const table = WebImporter.DOMUtils.createTable(cells, document);
            iframe.replaceWith(table);
          }
        });
      }
}