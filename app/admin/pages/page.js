"use client";
import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";

const emptyForm = { slug: "", title: "", content: "", isPublished: true };

export default function PagesAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const res = await fetch("/api/pages");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/pages/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/pages", {
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
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminGuard>
      <main className="wrap">
        <h1 style={{ marginBottom: 20 }}>Pages</h1>
        <p style={{ color: "var(--sand)", marginBottom: 20 }}>
          New pages appear live at yoursite.com/the-slug-you-choose — no code needed.
        </p>

        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 30, display: "grid", gap: 12, maxWidth: 560 }}>
          <h3>{editingId ? "Edit page" : "Add new page"}</h3>
          <div>
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label>URL slug (e.g. careers, events)</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div>
            <label>Content (HTML allowed)</label>
            <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="submit">{editingId ? "Save changes" : "Create page"}</button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <table>
          <thead><tr><th>Title</th><th>URL</th><th></th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td><a href={`/${p.slug}`} target="_blank">/{p.slug}</a></td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn ghost" onClick={() => editItem(p)}>Edit</button>
                  <button className="btn ghost" onClick={() => deleteItem(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </AdminGuard>
  );
}
