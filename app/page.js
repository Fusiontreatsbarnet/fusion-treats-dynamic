const { prisma } = require("../lib/prisma");
const MenuBrowser = require("../components/MenuBrowser").default;

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [menuItems, reviews, pages] = await Promise.all([
    prisma.menuItem.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.review.findMany({ where: { isFeatured: true }, orderBy: { createdAt: "desc" } }),
    prisma.page.findMany({ where: { isPublished: true } }),
  ]);

  return (
    <main>
      <header>
        <nav className="topnav">
          <a href="#home" className="logo">FUSION <span>TREATS</span></a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#menu">Menu</a>
            <a href="#reviews">Reviews</a>
            <a href="#catering">Catering</a>
            <a href="#contact">Find Us</a>
            {pages.map((p) => (
              <a key={p.id} href={`/${p.slug}`}>{p.title}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="tel:+447344449812" className="btn ghost">Call Us</a>
            <a href="#contact" className="btn">Order Now</a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero wrap" id="home">
        <div>
          <span className="label">High Barnet, London</span>
          <h1>British classics,<br /><em>rewired</em> with spice.</h1>
          <p>Fusion Treats — smash burgers, loaded fries, rice bowls and sandwiches, built on authentic Indian flavour. Freshly prepared, cooked to order, every single day.</p>
          <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
            <a href="#menu" className="btn">View The Menu</a>
            <a href="#catering" className="btn ghost">Book Catering</a>
          </div>
        </div>
        <div className="window"><span className="window-tag">Serving Window · Open Daily</span></div>
      </section>

      {/* ABOUT */}
      <section className="alt pad" id="about">
        <div className="wrap">
          <span className="label">About Us</span>
          <h2 style={{ margin: "10px 0 16px" }}>Two food cultures, one order window.</h2>
          <p style={{ color: "var(--sand)", maxWidth: 640 }}>
            Fusion Treats is the trading name of S &amp; D Vision Ltd — British street-food comfort,
            finished with bold, authentic Indian spice blends. Fresh, affordable, innovative, consistent, memorable.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginTop: 28 }}>
            <div className="card"><h3 style={{ color: "var(--turquoise)", marginBottom: 6 }}>Quality</h3><p style={{ color: "var(--sand)", fontSize: "0.88rem" }}>Fresh ingredients, fresh prep, consistent standards.</p></div>
            <div className="card"><h3 style={{ color: "var(--turquoise)", marginBottom: 6 }}>Innovation</h3><p style={{ color: "var(--sand)", fontSize: "0.88rem" }}>Modern British food, authentic Indian flavour.</p></div>
            <div className="card"><h3 style={{ color: "var(--turquoise)", marginBottom: 6 }}>Customer Satisfaction</h3><p style={{ color: "var(--sand)", fontSize: "0.88rem" }}>Every customer deserves an outstanding experience.</p></div>
            <div className="card"><h3 style={{ color: "var(--turquoise)", marginBottom: 6 }}>Integrity</h3><p style={{ color: "var(--sand)", fontSize: "0.88rem" }}>Honest, professional, responsible operation.</p></div>
            <div className="card"><h3 style={{ color: "var(--turquoise)", marginBottom: 6 }}>Community</h3><p style={{ color: "var(--sand)", fontSize: "0.88rem" }}>Supporting Barnet through food and service.</p></div>
          </div>
        </div>
      </section>

      {/* MENU (live from DB) */}
      <section className="pad" id="menu">
        <div className="wrap">
          <span className="label">The Menu</span>
          <h2 style={{ margin: "10px 0 24px" }}>Built to order, loaded with flavour.</h2>
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

      {/* REVIEWS (live from DB) */}
      <section className="alt pad" id="reviews">
        <div className="wrap">
          <span className="label">Reviews</span>
          <h2 style={{ margin: "10px 0 24px" }}>What Barnet is saying.</h2>
          <div className="review-grid">
            {reviews.map((r) => (
              <div className="card" key={r.id}>
                <div className="stars">{"★".repeat(r.rating)}</div>
                <p style={{ color: "var(--sand)", fontSize: "0.9rem" }}>{r.content}</p>
                <p style={{ marginTop: 10, fontWeight: 700 }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HYGIENE */}
      <section className="pad" id="hygiene">
        <div className="wrap">
          <span className="label">Food Quality &amp; Hygiene</span>
          <h2 style={{ margin: "10px 0 24px" }}>Freshness isn't a slogan here.</h2>
          <div className="hygiene-grid">
            {[
              "Daily cleaning and sanitisation of the truck and all equipment.",
              "Temperature-controlled storage for every ingredient.",
              "Fresh ingredients prepared daily, never held over.",
              "Active allergen awareness and management.",
              "Staff trained to UK food hygiene standards.",
              "Full compliance with UK food safety regulations.",
            ].map((t, i) => (
              <div className="hygiene-item" key={i}><span className="dot"></span><p style={{ color: "var(--sand)", fontSize: "0.9rem" }}>{t}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* CATERING */}
      <section className="alt pad" id="catering">
        <div className="wrap two-col">
          <div>
            <span className="label">Catering</span>
            <h2 style={{ margin: "10px 0 14px" }}>Fusion Treats, at your event.</h2>
            <p style={{ color: "var(--sand)", maxWidth: 480 }}>Custom catering packages for events of every size, built around the same menu Barnet already loves.</p>
            <div style={{ marginTop: 20 }}>
              {["Corporate Events", "Business Lunches", "Birthday Parties", "Private Functions", "Community Events", "Festivals", "University Events", "Sporting Events"].map((c) => (
                <span className="chip" key={c}>{c}</span>
              ))}
            </div>
          </div>
          <form action="mailto:s.d.businessuk25@gmail.com" method="post" encType="text/plain">
            <h3>Get a catering quote</h3>
            <div><label>Name</label><input name="name" required /></div>
            <div><label>Email</label><input name="email" type="email" required /></div>
            <div><label>Event details</label><textarea name="details" rows={4} /></div>
            <button className="btn" type="submit">Send Enquiry</button>
          </form>
        </div>
      </section>

      {/* CONTACT */}
      <section className="pad" id="contact">
        <div className="wrap two-col">
          <div>
            <span className="label">Find Us</span>
            <h2 style={{ margin: "10px 0 20px" }}>Come say hello.</h2>
            <div className="info-row"><div className="k">📍 Visit Us</div><div className="v">Bandstand Area, The Spires Shopping Centre, 111 High Street, High Barnet, London EN5 5XY, United Kingdom</div></div>
            <div className="info-row"><div className="k">Hours</div><div className="v">Mon–Sat 11:00 AM–8:00 PM<br />Sun 11:00 AM–6:30 PM</div></div>
            <div className="info-row"><div className="k">📧 Email</div><div className="v"><a href="mailto:s.d.businessuk25@gmail.com">s.d.businessuk25@gmail.com</a></div></div>
            <div className="info-row"><div className="k">📞 Phone</div><div className="v"><a href="tel:+447344449812">+44 7344 449812</a></div></div>
            <div style={{ marginTop: 16 }}>
              <a className="chip" href="https://instagram.com/fusiontreats.barnet" target="_blank">Instagram</a>
              <a className="chip" href="https://tiktok.com/@fusiontreats.barnet" target="_blank">TikTok</a>
            </div>
          </div>
          <div className="window" style={{ minHeight: 300, padding: 0 }}>
            <iframe
              title="Fusion Treats location"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: "var(--radius-window)" }}
              src="https://www.google.com/maps?q=The+Spires+Shopping+Centre,+High+Barnet,+London+EN5+5XY&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p style={{ marginBottom: 14 }}>Fusion Treats is the trading name of S &amp; D Vision Ltd, a company registered in England and Wales.</p>
          <p>© {new Date().getFullYear()} S &amp; D Vision Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
