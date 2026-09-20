import { useEffect } from "react";

const publicRoutes = new Set(["/", "/about", "/projects", "/contact"]);

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!url) {
    canonical?.remove();
    return;
  }

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

function Seo({ copy, language, pathname }) {
  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const isAdmin = normalizedPath.startsWith("/admin");
    const isPublicPage = publicRoutes.has(normalizedPath);
    const routeKey = isPublicPage ? normalizedPath : "notFound";
    const title = isAdmin
      ? `Admin | ${copy.brand}`
      : copy.pageTitles[routeKey];
    const description = isAdmin
      ? "Secure Matrabhumi administration."
      : copy.pageDescriptions[routeKey];
    const siteUrl = (
      import.meta.env.VITE_SITE_URL || window.location.origin
    ).replace(/\/+$/, "");
    const canonicalUrl = isPublicPage
      ? `${siteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`
      : "";
    const shareImageUrl = `${siteUrl}/matrabhumi-share.png`;
    const robots = isPublicPage
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow, noarchive";

    document.title = title;
    setCanonical(canonicalUrl);
    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    setMeta('meta[name="robots"]', { name: "robots", content: robots });
    setMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    setMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Matrabhumi Construction",
    });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl || `${siteUrl}/`,
    });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: shareImageUrl,
    });
    setMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: language === "hi" ? "hi_IN" : "en_IN",
    });
    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: shareImageUrl,
    });
  }, [copy, language, pathname]);

  return null;
}

export default Seo;
