import SectionHeading from "@/components/ui/SectionHeading";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="container-xl pb-20 pt-40 md:pt-48">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
    </section>
  );
}
