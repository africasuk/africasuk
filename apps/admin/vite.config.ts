
import { defineConfig, loadEnv } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { workersCacheCdnAdapter } from "@vinext/cloudflare/cache/workers-cache-cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("[admin env check]", {
    supabaseUrl: Boolean(env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleKey: Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
  });

  return {
    plugins: [
      vinext({
        cache: {
          cdn: workersCacheCdnAdapter(),
        },
        images: {
          optimizer: imagesOptimizer(),
        },
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
        lightningcss: path.resolve(__dirname, "empty-stub.js"),
      },
    },
  };
});
