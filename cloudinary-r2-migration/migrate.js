require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
const mappingFile = "r2-migration-mapping.jsonl";
const failuresFile = "r2-migration-failures.jsonl";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function appendJsonLine(file, value) {
  fs.appendFileSync(file, JSON.stringify(value) + "\n");
}

async function getAllAssets() {
  const assets = [];
  let nextCursor;

  do {
    const result = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      max_results: 500,
      next_cursor: nextCursor,
    });

    assets.push(...result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return assets;
}

async function migrateAsset(asset) {
  // Keep Cloudinary's public ID and original extension.
  const key = `${asset.public_id}.${asset.format}`;

  try {
    // Skip objects already present, allowing safe reruns.
    try {
      await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      return {
        status: "skipped-existing",
        public_id: asset.public_id,
        key,
        old_url: asset.secure_url,
        new_url: `${publicUrl}/${key.split("/").map(encodeURIComponent).join("/")}`,
      };
    } catch (error) {
      if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
        throw error;
      }
    }

    const response = await fetch(asset.secure_url);
    if (!response.ok) {
      throw new Error(`Cloudinary download failed: HTTP ${response.status}`);
    }

    const body = Buffer.from(await response.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: response.headers.get("content-type") ||
          `image/${asset.format}`,
      })
    );

    const newUrl = `${publicUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;

    return {
      status: "uploaded",
      public_id: asset.public_id,
      key,
      bytes: body.length,
      old_url: asset.secure_url,
      new_url: newUrl,
    };
  } catch (error) {
    return {
      status: "failed",
      public_id: asset.public_id,
      old_url: asset.secure_url,
      error: error.message,
    };
  }
}

async function main() {
  if (!bucket || !publicUrl) {
    throw new Error("Missing R2_BUCKET_NAME or R2_PUBLIC_URL in .env");
  }

  const assets = await getAllAssets();
  console.log(`Found ${assets.length} Cloudinary image assets.`);

  if (assets.length !== 547) {
    console.log("Notice: asset count differs from the earlier inventory.");
  }

  // Start fresh migration reports, not bucket contents.
  fs.writeFileSync(mappingFile, "");
  fs.writeFileSync(failuresFile, "");

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < assets.length; i++) {
    const result = await migrateAsset(assets[i]);

    if (result.status === "failed") {
      failed++;
      appendJsonLine(failuresFile, result);
      console.log(`[${i + 1}/${assets.length}] FAILED ${result.public_id}: ${result.error}`);
    } else {
      appendJsonLine(mappingFile, result);
      if (result.status === "uploaded") uploaded++;
      else skipped++;

      console.log(`[${i + 1}/${assets.length}] ${result.status}: ${result.public_id}`);
    }

    // Keep API requests at a gentle pace.
    await sleep(150);
  }

  console.log("\nMigration finished.");
  console.log({ total: assets.length, uploaded, skipped, failed });
  console.log(`Mapping: ${mappingFile}`);
  console.log(`Failures: ${failuresFile}`);
}

main().catch((error) => {
  console.error("Migration stopped:", error.message);
  process.exit(1);
});