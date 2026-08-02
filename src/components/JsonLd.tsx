import { site } from "@/lib/data/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    url: site.url,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
    },
    sameAs: site.social.map((s) => s.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
