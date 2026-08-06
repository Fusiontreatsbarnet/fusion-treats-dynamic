export default function SiteHeader({ pages = [] }) {
  return (
    <header>
      <nav className="topnav">
        <a href="/" className="logo">FUSION <span>TREATS</span></a>
        <div className="nav-links">
          <a href="/#about">About</a>
          <a href="/menu">Menu</a>
          <a href="/#reviews">Reviews</a>
          <a href="/#catering">Catering</a>
          <a href="/#contact">Find Us</a>
          {pages.map((p) => (
            <a key={p.id} href={`/${p.slug}`}>{p.title}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="tel:+447344449812" className="btn ghost">Call Us</a>
          <a href="/#contact" className="btn">Order Now</a>
        </div>
      </nav>
    </header>
  );
}
