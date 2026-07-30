"use client";
import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";

const emptyForm = { name: "", rating: 5, content: "", isFeatured: true };

export default function ReviewsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const res = await fetch("/api/reviews");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/reviews/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  function editItem(item) {
    setForm(item);
    setEditingId(item.id);
  }

  async function deleteItem(id) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminGuard>
      <main className="wrap">
        <h1 style={{ marginBottom: 20 }}>Reviews</h1>

        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 30, display: "grid", gap: 12, maxWidth: 520 }}>
          <h3>{editingId ? "Edit review" : "Add review"}</h3>
          <div>
            <label>Reviewer name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label>Rating (1-5)</label>
            <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
          </div>
          <div>
            <label>Review text</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="submit">{editingId ? "Save changes" : "Add review"}</button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <table>
          <thead><tr><th>Name</th><th>Rating</th><th>Review</th><th></th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{"★".repeat(r.rating)}</td>
                <td style={{ maxWidth: 320 }}>{r.content}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn ghost" onClick={() => editItem(r)}>Edit</button>
                  <button className="btn ghost" onClick={() => deleteItem(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </AdminGuard>
  );
}
