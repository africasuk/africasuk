const fs = require("fs");

const mappings = fs
  .readFileSync("r2-migration-mapping.jsonl", "utf8")
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map(JSON.parse);

const productMappings = mappings.filter(
  (item) =>
    item.public_id.startsWith("africasuk/products/") &&
    item.new_url &&
    item.key
);

const keys = new Set(productMappings.map((item) => item.key));

console.log("Total R2 mappings:", mappings.length);
console.log("Product mappings:", productMappings.length);
console.log("Unique product object keys:", keys.size);
console.log("Sample mapping:", productMappings[0]);