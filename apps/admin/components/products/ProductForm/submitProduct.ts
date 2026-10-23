
import type { ProductWithDetails } from "@africasuk/types";
import type { Color, ProductInfo } from "./types";

interface SubmitProductParams {
  product?: ProductWithDetails;
  info: ProductInfo;
  colors: Color[];
  onProgress?: (completed: number, total: number, fileName: string) => void;
}

const MAX_IMAGE_DIMENSION = 1600;
const MAX_COMPRESSED_IMAGE_SIZE = 700 * 1024;
const MAX_SOURCE_IMAGE_SIZE = 50 * 1024 * 1024;
const MAX_CONCURRENT_UPLOADS = 2;
const MAX_UPLOAD_ATTEMPTS = 4;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertValidProductId(id: string): void {
  if (!UUID_REGEX.test(id)) {
    throw new Error(`Invalid product ID received by form: ${id}`);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function canvasToWebP(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob && blob.type === "image/webp") {
          resolve(blob);
        } else {
          reject(new Error("WebP encoding is not supported by this browser."));
        }
      },
      "image/webp",
      quality,
    );
  });
}

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image.`);
  }

  if (file.size === 0) {
    throw new Error(`"${file.name}" is empty.`);
  }

  if (file.size > MAX_SOURCE_IMAGE_SIZE) {
    throw new Error(`"${file.name}" exceeds the 50 MB source-image limit.`);
  }

  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
      file.type,
    )
  ) {
    throw new Error(
      `"${file.name}" must be JPG, PNG, WebP, or AVIF. Animated GIF and SVG are not supported.`,
    );
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`Could not read "${file.name}". Try another image.`);
  }

  try {
    let scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );

    // Re-encode even small images to normalize the upload format and size.
    for (let attempt = 0; attempt < 18; attempt++) {
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Image compression is unavailable in this browser.");
      }

      context.drawImage(bitmap, 0, 0, width, height);

      // Lower quality progressively, then reduce dimensions if necessary.
      const quality = Math.max(0.35, 0.84 - (attempt % 7) * 0.08);
      const blob = await canvasToWebP(canvas, quality);

      if (blob.size <= MAX_COMPRESSED_IMAGE_SIZE) {
        const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

        return new File([blob], `${baseName}.webp`, {
          type: "image/webp",
          lastModified: Date.now(),
        });
      }

      if (attempt % 3 === 2 || blob.size > MAX_COMPRESSED_IMAGE_SIZE * 2) {
        scale *= 0.8;
      }

      if (width <= 320 && height <= 320) {
        break;
      }
    }

    throw new Error(
      `"${file.name}" could not be compressed below 700 KB. Please choose a different or smaller image.`,
    );
  } finally {
    bitmap.close();
  }
}

async function uploadImage(file: File): Promise<string> {
  const compressedFile = await compressImage(file);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
    try {
      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);

      const response = await fetch("/api/products/images", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => ({}))) as {
        url?: string;
        message?: string;
      };

      if (response.ok && typeof result.url === "string") {
        return result.url;
      }

      const error = new Error(
        result.message ||
          `Failed to upload "${file.name}" (HTTP ${response.status}).`,
      );

      // Retry temporary server/network errors, not permanent validation errors.
      const retryable =
        response.status === 408 ||
        response.status === 425 ||
        response.status === 429 ||
        response.status >= 500;

      if (!retryable || attempt === MAX_UPLOAD_ATTEMPTS) {
        throw error;
      }

      lastError = error;
    } catch (error) {
      if (
        error instanceof Error &&
        /HTTP \d+/.test(error.message) &&
        !/(HTTP (408|425|429|5\d\d))/.test(error.message)
      ) {
        throw error;
      }

      lastError =
        error instanceof Error
          ? error
          : new Error(`Failed to upload "${file.name}".`);

      if (attempt === MAX_UPLOAD_ATTEMPTS) {
        break;
      }
    }

    await wait(Math.min(1000 * 2 ** (attempt - 1), 8000));
  }

  throw new Error(
    `"${file.name}" failed after ${MAX_UPLOAD_ATTEMPTS} attempts. ${
      lastError?.message ?? "Check your connection and retry."
    }`,
  );
}

async function uploadInBatches(
  files: File[],
  onProgress?: SubmitProductParams["onProgress"],
): Promise<string[]> {
  const urls = new Array<string>(files.length);
  let nextIndex = 0;
  let completed = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex++;

      if (index >= files.length) return;

      const file = files[index];

      try {
        urls[index] = await uploadImage(file);
        completed++;
        onProgress?.(completed, files.length, file.name);
      } catch (error) {
        throw new Error(
          `Image ${index + 1} of ${files.length} failed ("${file.name}"): ${
            error instanceof Error ? error.message : "Unknown upload error."
          }`,
        );
      }
    }
  }

  // Stop scheduling more uploads after a failure. Already-running uploads
  // may finish, but product creation will not proceed.
  let failed = false;

  async function safeWorker(): Promise<void> {
    try {
      await worker();
    } catch (error) {
      failed = true;
      throw error;
    }
  }

  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENT_UPLOADS, files.length) },
    () => safeWorker(),
  );

  const results = await Promise.allSettled(workers);
  const failure = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failure) {
    throw failure.reason;
  }

  if (failed || urls.some((url) => !url)) {
    throw new Error("Not all product images uploaded successfully.");
  }

  return urls;
}

export async function submitProduct({
  product,
  info,
  colors,
  onProgress,
}: SubmitProductParams) {
  if (product?.id) {
    assertValidProductId(product.id);
  }

  // Deduplicate new files shared by multiple color entries.
  const files: File[] = [];
  const seenFiles = new Set<File>();

  for (const color of colors) {
    for (const image of color.images) {
      if (image.file && !seenFiles.has(image.file)) {
        seenFiles.add(image.file);
        files.push(image.file);
      }
    }
  }

  // Do not save the product unless every new image upload succeeds.
  const uploadedUrls = await uploadInBatches(files, onProgress);
  const urlByFile = new Map<File, string>();

  files.forEach((file, index) => {
    urlByFile.set(file, uploadedUrls[index]);
  });

  const payload = colors.map((color) => ({
    name: color.name,
    optionName: color.optionName,
    images: color.images
      .map((image) =>
        image.file ? urlByFile.get(image.file) : image.url,
      )
      .filter((url): url is string => typeof url === "string" && !!url),
    variants: color.variants.map((variant) => ({
      optionValue: variant.optionValue,
      price: variant.price,
      stock: variant.stock,
      sku: variant.sku || null,
    })),
  }));

  const body = {
    name: info.name,
    description: info.description,
    categoryId: info.categoryId,
    brandId: info.brandId,
    isActive: info.isActive,
    colors: payload,
  };

  const url = product?.id
    ? `/api/products/${product.id}`
    : "/api/products";

  const response = await fetch(url, {
    method: product?.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      result.message || `Failed to save product (HTTP ${response.status}).`,
    );
  }

  return result;
}
