/* global WebImporter */
export default function handleTable(document) {
  // Find all table elements in the document
  const tables = document.querySelectorAll('table');
  
  for (const table of tables) {
    // Define the header row for the block table
    const headerRow = ['Table'];

    // Extract table rows from the table element
    const rows = table.querySelectorAll('tr');
    
    // Process each row to extract data and organize it into cells
    const tableRows = Array.from(rows).map((row) => {
      const cells = row.querySelectorAll('td, th');
      return Array.from(cells).map((cell) => {
        return cell.innerHTML.trim();
      });
    });

    // Combine the header row and the table rows
    const tableData = [headerRow, ...tableRows];

    // Create the block table using WebImporter.DOMUtils.createTable
    const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

    // Replace the original table with the new block table
    table.replaceWith(blockTable);
  }
}
