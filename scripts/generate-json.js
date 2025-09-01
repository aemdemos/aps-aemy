const fs = require("fs");

const data = [
  { name: "Alice", age: 30, city: "Sydney" },
  { name: "Bob", age: 25, city: "Melbourne" },
];

fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
