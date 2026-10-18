const fs = require("fs");

const mappings = fs
  .readFileSync("r2-migration-mapping.jsonl", "utf8")
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map(JSON.parse);

function sqlString(value) {
  return "'" + value.replace(/'/g, "''") + "'";
}

const updates = mappings
  .filter(
    (item) =>
      item.status === "uploaded" &&
      item.public_id.startsWith("africasuk/products/") &&
      item.key &&
      item.new_url
  )
  .map((item) => {
    const suffix = "/" + item.key;

    return `UPDATE public.product_images
SET image_url = ${sqlString(item.new_url)}
WHERE right(image_url, length(${sqlString(suffix)})) = ${sqlString(suffix)}
  AND image_url LIKE 'https://res.cloudinary.com/kwlkw1ta/%';`;
  });

fs.writeFileSync(
  "supabase-image-update.sql",
  [
    "-- Review before running. Original URLs are backed up.",
    "BEGIN;",
    ...updates,
    "COMMIT;",
    "",
  ].join("\n\n"),
  "utf8"
);

console.log(`Product image mappings prepared: ${updates.length}`);
console.log("SQL saved to supabase-image-update.sql");
console.log("Do not execute until we review the generated SQL.");