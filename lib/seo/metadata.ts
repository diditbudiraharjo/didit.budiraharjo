import type { Metadata } from "next";

type RouteSeo = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function buildMetadata({ title, description, path, noindex = false }: RouteSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description, url: path, type: "website" },
    twitter: { title, description },
  };
}
