"use client";
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

export default function AdminHome() {
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/pages").then((r) => r.json()),
    ]).then(([m, r, p]) => {
      setMenuItems(m);
      setReviews(r);
      setPages(p);
      setLoading(false);
    });
  }, []);

  const categoryCount = new Set(menuItems.map((i) => i.category)).size;
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const publishedPages = pages.filter((p) => p.isPublished).length;

  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <AdminGuard>
      <div className="admin-page" style={{ maxWidth: "none" }}>
        <h1 style={{ marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: "var(--sand)", marginBottom: 28 }}>
          Here's what's happening with Fusion Treats today.
        </p>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon blue">🍔</div>
            <div><div className="stat-number">{loading ? "—" : menuItems.length}</div><div className="stat-label">Menu Items</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal">🏷️</div>
            <div><div className="stat-number">{loading ? "—" : categoryCount}</div><div className="stat-label">Categories</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⭐</div>
            <div><div className="stat-number">{loading ? "—" : reviews.length}</div><div className="stat-label">Reviews</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📈</div>
            <div><div className="stat-number">{loading ? "—" : avgRating}</div><div className="stat-label">Avg. Rating</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">📄</div>
            <div><div className="stat-number">{loading ? "—" : pages.length}</div><div className="stat-label">Custom Pages</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div><div className="stat-number">{loading ? "—" : publishedPages}</div><div className="stat-label">Published Pages</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">🔥</div>
            <div><div className="stat-number">{loading ? "—" : menuItems.filter((i) => i.badge).length}</div><div className="stat-label">Badged Items</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal">🖼️</div>
            <div><div className="stat-number">{loading ? "—" : menuItems.filter((i) => i.imageUrl).length}</div><div className="stat-label">Items With Photos</div></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <h2>Recent Reviews</h2>
              <a href="/admin/reviews">View All</a>
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Rating</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {recentReviews.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{"★".repeat(r.rating)}</td>
                      <td><span className={`status-pill ${r.isFeatured ? "on" : "off"}`}>{r.isFeatured ? "Featured" : "Hidden"}</span></td>
                      <td>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    </tr>
                  ))}
                  {!loading && recentReviews.length === 0 && (
                    <tr><td colSpan={4} style={{ color: "var(--sand)", padding: "20px 8px" }}>No reviews yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="panel" style={{ padding: 20 }}>
              <h2 style={{ marginBottom: 16, fontSize: "1.05rem" }}>Quick Actions</h2>
              <div className="quick-actions">
                <a className="quick-action-tile" href="/admin/menu">
                  <div className="stat-icon blue">🍔</div>
                  <span>Manage Menu</span>
                </a>
                <a className="quick-action-tile" href="/admin/reviews">
                  <div className="stat-icon orange">⭐</div>
                  <span>Add Review</span>
                </a>
                <a className="quick-action-tile" href="/admin/pages">
                  <div className="stat-icon teal">📄</div>
                  <span>Add Page</span>
                </a>
                <a className="quick-action-tile" href="/" target="_blank">
                  <div className="stat-icon green">🌐</div>
                  <span>View Site</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
