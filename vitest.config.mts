import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  resolve: {
    // Mirrors tsconfig.json's "@/*" path mapping -- tsc resolves it for
    // typechecking, but vitest needs its own alias to resolve it at
    // runtime for tests that import application code (e.g.
    // tests/rate-limit.test.ts importing lib/rate-limit.ts).
    alias: { "@": import.meta.dirname },
  },
  test: {
    // Loads .env.local (and friends) for local runs; in CI the same
    // variables are already set as real secrets, so this is a no-op there
    // (no .env.local file exists) rather than overriding them.
    env: loadEnv(mode, process.cwd(), ""),
    include: ["tests/**/*.test.ts"],
    testTimeout: 20000,
  },
}));
