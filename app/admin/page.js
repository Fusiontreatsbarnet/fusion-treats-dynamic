"use client";
import AdminGuard from "../../components/AdminGuard";

export default function AdminHome() {
  return (
    <AdminGuard>
      <main className="wrap">
        <h1 style={{ marginBottom: 16 }}>Welcome back</h1>
        <p style={{ color: "var(--sand)", marginBottom: 24 }}>
          Manage your menu, reviews and site pages — changes go live immediately.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16 }}>
          <a className="card" href="/admin/menu">
            <h3>Menu</h3>
            <p style={{ color: "var(--sand)", fontSize: "0.85rem" }}>Add, edit, or remove menu items and prices.</p>
          </a>
          <a className="card" href="/admin/reviews">
            <h3>Reviews</h3>
            <p style={{ color: "var(--sand)", fontSize: "0.85rem" }}>Manage customer reviews shown on the site.</p>
          </a>
          <a className="card" href="/admin/pages">
            <h3>Pages</h3>
            <p style={{ color: "var(--sand)", fontSize: "0.85rem" }}>Create new pages without touching any code.</p>
          </a>
        </div>
      </main>
    </AdminGuard>
  );
}
