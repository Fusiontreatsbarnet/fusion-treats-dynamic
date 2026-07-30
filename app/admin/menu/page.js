"use client";
import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";

const emptyForm = { name: "", description: "", price: "", category: "", badge: "", imageUrl: "", isActive: true };

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const res = await fetch("/api/menu");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/menu/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/menu", {
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
    setForm({ ...item, badge: item.badge || "", imageUrl: item.imageUrl || "" });
    setEditingId(item.id);
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminGuard>
      <main className="wrap">
        <h1 style={{ marginBottom: 20 }}>Menu Items</h1>

        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 30, display: "grid", gap: 12, maxWidth: 520 }}>
          <h3>{editingId ? "Edit item" : "Add new item"}</h3>
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>Price (e.g. £7.99)</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label>Category (e.g. burgers)</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>Badge (optional: NEW / POPULAR)</label>
              <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            </div>
            <div>
              <label>Image URL (optional)</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="submit">{editingId ? "Save changes" : "Add item"}</button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name} {item.badge && <span className="badge">{item.badge}</span>}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn ghost" onClick={() => editItem(item)}>Edit</button>
                  <button className="btn ghost" onClick={() => deleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </AdminGuard>
  );
}
