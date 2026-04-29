import Link from "next/link";

type LegalSection = {
  title: string;
  content: string;
};

type LegalPageTemplateProps = {
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export default function LegalPageTemplate({
  title,
  description,
  updatedAt,
  sections,
}: LegalPageTemplateProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-10 space-y-3">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p className="text-base" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Last updated: {updatedAt}
        </p>
      </header>

      <section className="space-y-6">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border p-6"
            style={{
              borderColor: "var(--border-primary)",
              backgroundColor: "var(--overlay-light)",
            }}
          >
            <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {section.title}
            </h2>
            <p className="whitespace-pre-line leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {section.content}
            </p>
          </article>
        ))}
      </section>

      <footer className="mt-10">
        <Link href="/" className="text-sm" style={{ color: "var(--text-accent)" }}>
          Back to home
        </Link>
      </footer>
    </main>
  );
}
