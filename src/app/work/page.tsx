import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import WorkGrid from "@/components/sections/WorkGrid";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies from NUMA — product design, brand identity, web experiences, and motion for ambitious teams.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Selected case studies."
        description="A handful of the products, brands, and experiences we've shipped alongside founders and product teams."
      />
      <WorkGrid showHeading={false} />
      <CTA />
    </>
  );
}
