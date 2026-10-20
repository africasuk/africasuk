
import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersCacheConfig } from "@vinext/cloudflare/cache/config";

const cache = await createWorkersCacheConfig();

export default defineConfig({
  worker: defineWorker({
    ...cache,

    name: "admin",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat"],

    workersDev: true,
    previewUrls: true,

    domains: [
      {
        hostname: "as.africasuk.com",
        production: true,
        previews: false,
      },
    ],

    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: [
        "/*",
        "!/_next/static/*",
        "!/*/_next/static/*",
      ],
    },

    env: {
      ...cache.env,

      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),

      R2_MEDIA: bindings.r2({
        name: "africasuk-media",
      }),

      CLOUDFLARE_ACCOUNT_ID: {
        type: "text",
        value: process.env.CLOUDFLARE_ACCOUNT_ID!,
      },

      R2_BUCKET_NAME: {
        type: "text",
        value: "africasuk-media",
      },
    },
  }),
});
