/**
 * Shared <head>-only SEO metadata — canonical link + Open Graph/Twitter
 * tags. Deliberately reuses whatever title/description a route already
 * passes to its own <title>/<meta name="description"> rather than
 * inventing new copy, so this never changes what a page says — only what
 * invisible metadata search engines and link-preview crawlers see.
 */
export const SITE_URL = "https://projectilluminate.org";

export function seoTags({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = `${SITE_URL}${path}`;
  return [
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Illuminate" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}
