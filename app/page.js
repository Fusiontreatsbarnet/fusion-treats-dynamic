const { prisma } = require("../lib/prisma");

// Always fetch fresh from the DB rather than caching at build time,
// since menu/reviews change from the admin panel.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [menuItems, reviews, pages] = await Promise.all([
    prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.review.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.page.findMany({ where: { isPublished: true } }),
  ]);

  const categories = [...new Set(menuItems.map((m) => m.category))];

  return (
    <main>
      <header className="wrap" style={{ padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: "1.4rem" }}>FUSION <span style={{ color: "var(--turquoise)" }}>TREATS</span></strong>
        <nav style={{ display: "flex", gap: 18, fontSize: "0.85rem" }}>
          <a href="#menu">Menu</a>
          <a href="#reviews">Reviews</a>
          {pages.map((p) => (
            <a key={p.id} href={`/${p.slug}`}>{p.title}</a>
          ))}
        </nav>
      </header>

      <section className="wrap" style={{ padding: "60px 0" }}>
        <span className="label">High Barnet, London</span>
        <h1 style={{ fontSize: "2.6rem", margin: "10px 0" }}>British classics, rewired with spice.</h1>
        <p style={{ color: "var(--sand)", maxWidth: 560 }}>
          Fusion Treats — smash burgers, loaded fries, rice bowls and sandwiches, built on authentic Indian flavour.
        </p>
      </section>

      <section id="menu" className="wrap" style={{ padding: "40px 0" }}>
        <h2 style={{ marginBottom: 24 }}>The Menu</h2>
        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: 32 }}>
            <h3 style={{ color: "var(--turquoise)", marginBottom: 12, textTransform: "capitalize" }}>{cat}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 16 }}>
              {menuItems
                .filter((m) => m.category === cat)
                .map((item) => (
                  <div className="card" key={item.id}>
                    <h4>
                      {item.name} {item.badge && <span className="badge">{item.badge}</span>}
                    </h4>
                    <p style={{ color: "var(--sand)", fontSize: "0.88rem", margin: "6px 0" }}>{item.description}</p>
                    <strong style={{ color: "var(--amber)" }}>{item.price}</strong>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

      <section id="reviews" className="wrap" style={{ padding: "40px 0" }}>
        <h2 style={{ marginBottom: 24 }}>Reviews</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 16 }}>
          {reviews.map((r) => (
            <div className="card" key={r.id}>
              <div style={{ color: "var(--amber)" }}>{"★".repeat(r.rating)}</div>
              <p style={{ color: "var(--sand)", fontSize: "0.9rem", margin: "10px 0" }}>{r.content}</p>
              <strong>— {r.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <footer className="wrap" style={{ padding: "30px 0", borderTop: "1px solid var(--line)", color: "var(--sand)", fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} S &amp; D Vision Ltd. All Rights Reserved.
      </footer>
    </main>
  );
}
