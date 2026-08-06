"use client";
import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import AdminPagination from "../../../components/AdminPagination";

const emptyForm = { name: "", rating: 5, content: "", isFeatured: true };

export default function ReviewsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(new Set());
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  async function load() {
    const res = await fetch("/api/reviews");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { setSelected(new Set()); }, [page, pageSize, search]);

  const q = search.trim().toLowerCase();
  const filteredItems = q
    ? items.filter((r) => r.name.toLowerCase().includes(q) || r.content.toLowerCase().includes(q))
    : items;
  const sortedItems = sortKey
    ? [...filteredItems].sort((a, b) => {
        let av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
        if (typeof av === "string") { av = av.toLowerCase(); bv = String(bv).toLowerCase(); }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      })
    : filteredItems;
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = sortedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setDrawerOpen(true);
  }

  function editItem(item) {
    setForm(item);
    setEditingId(item.id);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  }

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
    closeDrawer();
    load();
  }

  async function deleteItem(id) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setSelected((s) => { const next = new Set(s); next.delete(id); return next; });
    load();
  }

  function toggleSelect(id) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((s) => {
      const allSelected = pagedItems.length > 0 && pagedItems.every((i) => s.has(i.id));
      if (allSelected) return new Set();
      return new Set(pagedItems.map((i) => i.id));
    });
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} selected review(s)?`)) return;
    await Promise.all([...selected].map((id) => fetch(`/api/reviews/${id}`, { method: "DELETE" })));
    setSelected(new Set());
    load();
  }

  return (
    <AdminGuard>
      <div className="admin-page">
        <div className="admin-toolbar">
          <h1>Reviews</h1>
          <button className="btn" onClick={openAddForm}>+ Add Review</button>
        </div>

        <div className="dt-toolbar">
          <label className="dt-show">
            Show
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            entries
          </label>
          <label className="dt-search">
            Search:
            <input
              placeholder="Name or review text..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </label>
        </div>

        {selected.size > 0 && (
          <div className="admin-bulkbar">
            <span>{selected.size} selected</span>
            <button onClick={bulkDelete}>Delete selected</button>
            <button className="clear-selection" onClick={() => setSelected(new Set())}>Clear</button>
          </div>
        )}

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th className="col-check">
                  <input
                    type="checkbox"
                    checked={pagedItems.length > 0 && pagedItems.every((i) => selected.has(i.id))}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ width: "18%" }} className={`sortable-th ${sortKey === "name" ? "sorted" : ""}`} onClick={() => toggleSort("name")}>
                  Name <span className="arrows"><span>▲</span><span>▼</span></span>
                </th>
                <th style={{ width: "14%" }} className={`sortable-th ${sortKey === "rating" ? "sorted" : ""}`} onClick={() => toggleSort("rating")}>
                  Rating <span className="arrows"><span>▲</span><span>▼</span></span>
                </th>
                <th style={{ width: "38%" }}>Review</th>
                <th className="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((r) => (
                <tr key={r.id}>
                  <td className="col-check">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} />
                  </td>
                  <td>{r.name}</td>
                  <td>{"★".repeat(r.rating)}</td>
                  <td className="wrap-cell">{r.content}</td>
                  <td className="col-actions" style={{ display: "flex", gap: 8 }}>
                    <button className="btn ghost" onClick={() => editItem(r)}>Edit</button>
                    <button className="btn ghost" onClick={() => deleteItem(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {pagedItems.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--sand)", padding: "20px 8px" }}>
                  {items.length === 0 ? 'No reviews yet — click "+ Add Review" to create one.' : "No reviews match your search."}
                </td></tr>
              )}
            </tbody>
          </table>
          <AdminPagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredItems.length}
            onPageChange={setPage}
          />
        </div>
      </div>

      <div className={`admin-drawer-backdrop ${drawerOpen ? "open" : ""}`} onClick={closeDrawer} />
      <div className={`admin-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="admin-drawer-head">
          <h3>{editingId ? "Edit review" : "Add review"}</h3>
          <button type="button" className="admin-drawer-close" onClick={closeDrawer}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
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
            <button type="button" className="btn ghost" onClick={closeDrawer}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
