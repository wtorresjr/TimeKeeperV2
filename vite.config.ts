import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    rollupOptions: {
      external: [
        "@mapbox/node-pre-gyp", // Exclude this problematic package from the build
        "mock-aws-s3",
        "aws-sdk",
        "nock",
      ],
    },
  },
  optimizeDeps: {
    exclude: ["@mapbox/node-pre-gyp"], // Ensure it's not pre-optimized
  },
});
