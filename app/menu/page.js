const { prisma } = require("../../lib/prisma");
const MenuBrowser = require("../../components/MenuBrowser").default;
const SiteHeader = require("../../components/SiteHeader").default;
const SiteFooter = require("../../components/SiteFooter").default;

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [menuItems, pages] = await Promise.all([
    prisma.menuItem.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.page.findMany({ where: { isPublished: true } }),
  ]);

  return (
    <main>
      <SiteHeader pages={pages} />

      <section className="pad">
        <div className="wrap">
          <a href="/" style={{ color: "var(--turquoise)", fontSize: "0.85rem" }}>&larr; Back home</a>
          <span className="label" style={{ display: "block", marginTop: 16 }}>The Menu</span>
          <h1 style={{ margin: "10px 0 24px" }}>Built to order, loaded with flavour.</h1>
          <div style={{ border: "1px dashed var(--turquoise-dim)", borderRadius: 14, padding: "16px 20px", marginBottom: 30, background: "rgba(47,224,209,0.06)" }}>
            <p style={{ fontSize: "0.82rem", letterSpacing: "0.04em", color: "var(--turquoise)", marginBottom: 4 }}>🔥 MAINS SPECIAL OFFER 🔥</p>
            <p style={{ color: "var(--sand)", fontSize: "0.92rem" }}>Buy any 1 main item and get your 2nd main item for <strong style={{ color: "var(--cream)" }}>HALF PRICE!</strong></p>
          </div>
          <MenuBrowser items={menuItems} />
          <p style={{ marginTop: 26, fontSize: "0.85rem", color: "var(--sand)" }}>
            <strong style={{ color: "var(--cream)" }}>Signature sauces:</strong> Burger Sauce (House), Thai Sweet Chili, Spicy Sauce (House), Buffalo, Spicy BBQ.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
