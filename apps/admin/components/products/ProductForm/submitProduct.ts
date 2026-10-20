
import type { ProductWithDetails } from "@africasuk/types";
import type { Color, ProductInfo } from "./types";

interface SubmitProductParams {
  product?: ProductWithDetails;
  info: ProductInfo;
  colors: Color[];
}

const MAX_IMAGE_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const MAX_COMPRESSED_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_SOURCE_IMAGE_SIZE = 50 * 1024 * 1024;
const MAX_CONCURRENT_UPLOADS = 3;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not a supported image.`);
  }

  if (file.size > MAX_SOURCE_IMAGE_SIZE) {
    throw new Error(`"${file.name}" exceeds the 50 MB source-image limit.`);
  }

  // Preserve formats that should not be converted to JPEG.
  // The upload endpoint currently accepts only raster formats.
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    throw new Error(
      `"${file.name}" uses SVG or GIF. Please export it as JPG, PNG, or WebP first.`,
    );
  }

  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
    throw new Error(`"${file.name}" must be JPG, PNG, WebP, or AVIF.`);
  }

  if (file.size <= 350 * 1024 && file.type !== "image/avif") {
    return file;
  }

  const bitmap = await createImageBitmap(file).catch(() => null);

  if (!bitmap) {
    throw new Error(`Could not read "${file.name}". Please choose another image.`);
  }

  try {
    const scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Image compression is unavailable in this browser.");
    }

    // Try WebP first so transparent images retain their transparency.
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", JPEG_QUALITY);
    });

    if (webpBlob?.type === "image/webp") {
      if (webpBlob.size > MAX_COMPRESSED_IMAGE_SIZE) {
        throw new Error(
          `"${file.name}" remains larger than 2 MB after compression. Please use a smaller image.`,
        );
      }

      return new File(
        [webpBlob],
        `${file.name.replace(/\.[^.]+$/, "")}.webp`,
        { type: "image/webp", lastModified: Date.now() },
      );
    }

    // JPEG fallback: transparency is flattened onto white.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error(`Could not compress "${file.name}".`));
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    });

    if (jpegBlob.size > MAX_COMPRESSED_IMAGE_SIZE) {
      throw new Error(
        `"${file.name}" remains larger than 2 MB after compression. Please use a smaller image.`,
      );
    }

    return new File(
      [jpegBlob],
      `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
      { type: "image/jpeg", lastModified: Date.now() },
    );
  } finally {
    bitmap.close();
  }
}

async function uploadImage(file: File): Promise<string> {
  const compressedFile = await compressImage(file);
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

  if (!response.ok || typeof result.url !== "string") {
    throw new Error(
      result.message || `Failed to upload "${file.name}" (HTTP ${response.status}).`,
    );
  }

  return result.url;
}

async function uploadInBatches(files: File[]): Promise<string[]> {
  const urls = new Array<string>(files.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex++;

      if (index >= files.length) return;

      urls[index] = await uploadImage(files[index]);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(MAX_CONCURRENT_UPLOADS, files.length) },
      () => worker(),
    ),
  );

  return urls;
}

export async function submitProduct({
  product,
  info,
  colors,
}: SubmitProductParams) {
  // Collect each unique new file once.
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

  // Upload three images at a time to avoid one oversized request.
  const uploadedUrls = await uploadInBatches(files);
  const urlByFile = new Map<File, string>();

  files.forEach((file, index) => {
    urlByFile.set(file, uploadedUrls[index]);
  });

  const payload = colors.map((color) => ({
    name: color.name,
    optionName: color.optionName,
    images: color.images
      .map((image) => {
        if (image.file) return urlByFile.get(image.file) ?? "";
        return image.url ?? "";
      })
      .filter(Boolean),
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
