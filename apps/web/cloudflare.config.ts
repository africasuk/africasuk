
import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersResponseStoreServiceBindingConfig } from "@vinext/cloudflare/cache/config";

const responseStore = await createWorkersResponseStoreServiceBindingConfig({
  worker: {
    name: "web-response-store",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat"],
  },
  bucket: "web-response-store-cache-bodies",
});

export const responseStoreServiceBinding =
  responseStore.serviceBindingWorker;

export default defineConfig({
  worker: defineWorker({
    ...responseStore.applicationWorker,
    name: "web",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat"],

    domains: ["africasuk.com"],
    workersDev: false,

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
      ...responseStore.applicationWorker.env,
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),

      GEOCODING_PROVIDER: bindings.text("google"),
      MTN_API_BASE_URL: bindings.text(""),
      MTN_CALLBACK_URL: bindings.text(
        "http://localhost:3000/api/payments/mtn/callback"
      ),

      NEXT_PUBLIC_SUPABASE_URL: bindings.text(
        "https://gzfhrrnvstoeoaxdsbxc.supabase.co"
      ),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: bindings.text(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6Zmhycm52c3RvZW9heGRzYnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDM5NjgsImV4cCI6MjA5ODM3OTk2OH0._9WnYdL7gWlRiLeP0G_snTg-W7boCYjty3lvnTEMwHc"
      ),

      UPSTASH_REDIS_REST_URL: bindings.text(
        "https://curious-gopher-167023.upstash.io"
      ),
      ZEPTOMAIL_FROM_EMAIL: bindings.text("no-reply@africasuk.com"),
      ZEPTOMAIL_FROM_NAME: bindings.text("AfricaSuk"),

      GOOGLE_MAPS_API_KEY: bindings.secret(),
      LOCATIONIQ_API_KEY: bindings.secret(),
      MTN_CONSUMER_KEY: bindings.secret(),
      MTN_CONSUMER_SECRET: bindings.secret(),
      SUPABASE_SERVICE_ROLE_KEY: bindings.secret(),
      UPSTASH_REDIS_REST_TOKEN: bindings.secret(),
      ZEPTOMAIL_API_KEY: bindings.secret(),
    },
  }),
});
