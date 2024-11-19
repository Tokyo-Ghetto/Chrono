import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [/^d3.*$/, /^@nivo.*$/],
  },
  define: {
    "process.env.CLERK_SECRET_KEY": JSON.stringify(
      process.env.CLERK_SECRET_KEY
    ),
    "process.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(
      process.env.VITE_CLERK_PUBLISHABLE_KEY
    ),
  },
});
