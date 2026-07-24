import type { SectionAnalysisBundle } from "../types.js";
import { FORM_FIELD_LABELS } from "../placeholderContent.js";

export function formBlock(section: SectionAnalysisBundle): string {
  const fieldCount = Math.min(Math.max(section.components.inputs || 2, 1), FORM_FIELD_LABELS.length);
  const fields = FORM_FIELD_LABELS.slice(0, fieldCount);

  const fieldMarkup = fields.map((label) => {
    const isMessage = label === "Message";
    const input = isMessage
      ? `<textarea rows={4} className="rounded-lg border border-border bg-surface px-4 py-2 text-ink focus:border-brand focus:outline-none" />`
      : `<input type="${label === "Email" ? "email" : "text"}" className="rounded-lg border border-border bg-surface px-4 py-2 text-ink focus:border-brand focus:outline-none" />`;
    return [
      `      <label className="flex flex-col gap-1 text-sm font-medium text-ink">`,
      `        ${label}`,
      `        ${input}`,
      `      </label>`,
    ].join("\n");
  });

  return [
    `<div className="py-16">`,
    `  <SectionHeading title="Get in touch" subtitle="We'd love to hear from you." align="center" />`,
    `  <form className="mx-auto mt-8 flex max-w-lg flex-col gap-4">`,
    ...fieldMarkup,
    `    <Button variant="primary" type="submit">Send Message</Button>`,
    `  </form>`,
    `</div>`,
  ].join("\n");
}
