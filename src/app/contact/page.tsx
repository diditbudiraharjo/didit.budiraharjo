import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/sections/ContactForm";
import RevealText from "@/components/ui/RevealText";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with NUMA. Tell us about your product, brand, or web experience and we'll reply within one business day.",
};

const info = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
  },
  { label: "Studio", value: site.location },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us about your project."
        description="Fill out the form and we'll follow up within one business day with next steps and availability."
      />

      <section className="container-xl grid grid-cols-1 gap-16 pb-28 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-10">
          {info.map((item, i) => (
            <RevealText key={item.label} delay={i * 0.06}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-2 block font-display text-xl text-ink transition-colors hover:text-accent"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 font-display text-xl text-ink">
                  {item.value}
                </p>
              )}
            </RevealText>
          ))}

          <RevealText delay={0.2}>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
              Follow
            </p>
            <ul className="mt-2 space-y-1">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-display text-xl text-ink transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </RevealText>
        </div>

        <RevealText delay={0.1}>
          <ContactForm />
        </RevealText>
      </section>
    </>
  );
}
