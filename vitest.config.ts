import "dotenv/config";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Load .env before running tests
    env: process.env,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./__mocks__/server-only.ts"),
    },
  },
});
