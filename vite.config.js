import react from "@vitejs/plugin-react";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";

function normalizeSiteUrl(value) {
  const url = value || "http://localhost:5173";
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

function productionMetadata(siteUrl) {
  const publicPaths = ["/", "/about", "/projects", "/contact"];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPaths
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return {
    name: "matrabhumi-production-metadata",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrlValue = env.VITE_SITE_URL || process.env.CF_PAGES_URL;

  if (command === "build") {
    const missing = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"].filter(
      (name) => !env[name]?.trim(),
    );
    if (missing.length) {
      throw new Error(`Missing build environment variables: ${missing.join(", ")}`);
    }
    if (!siteUrlValue) {
      throw new Error(
        "Set VITE_SITE_URL to the public site address before building. Cloudflare Pages builds can use CF_PAGES_URL automatically.",
      );
    }
  }
  const siteUrl = normalizeSiteUrl(
    siteUrlValue,
  );

  return {
    plugins: [react(), productionMetadata(siteUrl)],
    define: {
      "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl),
    },
  };
});
