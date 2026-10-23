import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Las fechas de la agenda se comparan en Europe/Madrid pase lo que pase
    // con la zona del proceso: los tests corren en otra para comprobarlo.
    env: { TZ: "America/New_York" },
  },
});
