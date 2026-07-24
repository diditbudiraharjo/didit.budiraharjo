export function urlToSlug(pageUrl: string): string {
  const { pathname } = new URL(pageUrl);
  if (pathname === "" || pathname === "/") return "home";
  return pathname
    .replace(/^\/|\/$/g, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/\/+/g, "-")
    .toLowerCase();
}

export function domainSlug(siteUrl: string): string {
  return new URL(siteUrl).hostname.replace(/^www\./, "").replace(/[^a-zA-Z0-9.-]+/g, "-");
}
