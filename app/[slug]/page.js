const { prisma } = require("../../lib/prisma");

export const dynamic = "force-dynamic";

export default async function CustomPage({ params }) {
  const page = await prisma.page.findUnique({ where: { slug: params.slug } });

  if (!page || !page.isPublished) {
    return (
      <main className="wrap" style={{ padding: "60px 0" }}>
        <h1>Page not found</h1>
        <a href="/" className="btn ghost" style={{ marginTop: 20, display: "inline-block" }}>Back home</a>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ padding: "60px 0" }}>
      <a href="/" style={{ color: "var(--turquoise)", fontSize: "0.85rem" }}>&larr; Back home</a>
      <h1 style={{ margin: "16px 0" }}>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
