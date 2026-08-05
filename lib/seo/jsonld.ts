import { site, socials } from "@/config/site";
import { services } from "@/content/home";

export function organizationJsonLd() {
  const base = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description:
      "matte design is a creative agency delivering creative design, brand identities, and smart development.",
    email: site.email,
  };
  if (socials.length > 0) {
    return { ...base, sameAs: socials.map((s) => s.href) };
  }
  return base;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    publisher: { "@type": "Organization", name: site.name },
  };
}

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: site.tagline,
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.body,
      },
    })),
  };
}
