import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const isStorybook = process.argv[1]?.includes("storybook");
const isVitest = process.env.VITEST;
const isServerRunning = !isStorybook && !isVitest;

export default defineConfig({
  plugins: [
    isServerRunning && cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    isServerRunning && reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    // mock server-build for storybook and test-storybook avoid
    // > Internal server error: Failed to resolve import "virtual:react-router/server-build" from "workers/app.ts". Does the file exist?
    alias: !isServerRunning
      ? {
          "virtual:react-router/server-build": path.resolve(
            dirname,
            ".storybook/mock-server-build.ts"
          ),
        }
      : {},
  },
  test: {
    projects: [
      "vite.config.ts",
      {
        extends: "vite.config.ts",
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
        optimizeDeps: {
          // include vite bundle to avoid first time error about below
          // > Error: Failed to import test file .node_modules/.pnpm/@storybook+addon-vitest@9.0.5_@vitest+browser@3.2.2_@vitest+runner@3.2.2_react-dom@19.1_7fd573b6bb5c70d0d369de7af2669d44/node_modules/@storybook/addon-vitest/dist/vitest-plugin/setup-file.mjs
          include: [
            "react",
            "react-dom",
            "react/jsx-dev-runtime",
            "@storybook/react-vite",
            "@storybook/addon-vitest",
            "@vitest/browser",
          ],
          // exclude vite bundle to avoid about lightningcss error occured when include vite bundle avobe.
          // > Error : node_modules/.pnpm/lightningcss@1.30.1/node_modules/lightningcss/node/index.js:17:27: ERROR: Could not resolve "../pkg"
          exclude: ["playwright", "playwright-core", "lightningcss"],
        },
        build: {
          rollupOptions: {
            // exclude huge packages from vite bundle on pre-build by vitest
            external: [
              "playwright",
              "playwright-core",
              "lightningcss",
              "chromium-bidi",
            ],
          },
        },
      },
    ],
  },
});
