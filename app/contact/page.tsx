import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Tell matte design what you're building — creative design, brand identities, or smart development.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="tone-light bg-bg pb-24 pt-40 text-ink md:pt-48">
      <Container size="narrow">
        <SectionHeading
          id="contact-title"
          title="Talk to the studio."
          lead="Tell us about the project, the timeline, and where it needs to land — we reply within one business day."
        />
        <div className="mt-12">
          <ContactForm />
        </div>
        <p className="mt-8 text-sm text-muted">
          Prefer email?{" "}
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4 hover:opacity-70">
            {site.email}
          </a>
        </p>
      </Container>
    </div>
  );
}
