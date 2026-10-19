declare module "cloudflare:workers" {
  interface R2Bucket {
    put(
      key: string,
      value: ArrayBuffer,
      options?: {
        httpMetadata?: {
          contentType?: string;
        };
      },
    ): Promise<unknown>;
  }

  export const env: {
    R2_MEDIA: R2Bucket;
  };
}