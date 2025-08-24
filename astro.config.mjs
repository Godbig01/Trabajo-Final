import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), db()],
  output: "server",
  security: {
    checkOrigin: true
  },
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  devToolbar: {
    enabled: false
  }
});