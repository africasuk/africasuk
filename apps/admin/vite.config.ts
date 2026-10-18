import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { workersCacheCdnAdapter } from "@vinext/cloudflare/cache/workers-cache-cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import path from "node:path";

export default defineConfig({
  plugins: [
    vinext({
      cache: { cdn: workersCacheCdnAdapter() },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  resolve: {
    alias: {
      "lightningcss": path.resolve(__dirname, "empty-stub.js"),
    },
  },
});
