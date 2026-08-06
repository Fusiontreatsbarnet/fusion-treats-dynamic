"use client";
import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import AdminPagination from "../../../components/AdminPagination";

const emptyForm = { name: "", description: "", price: "", category: "", subCategory: "", badge: "", imageUrl: "", isActive: true };
const NEW_VALUE = "__new__";

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryIsNew, setCategoryIsNew] = useState(false);
  const [subCategoryIsNew, setSubCategoryIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(new Set());
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  async function load() {
    const res = await fetch("/api/menu");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { setSelected(new Set()); }, [page, pageSize, search]);

  const existingCategories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort();
  const existingSubCategories = [...new Set(
    items.filter((i) => i.category === form.category && i.subCategory).map((i) => i.subCategory)
  )].sort();

  const q = search.trim().toLowerCase();
  const filteredItems = q
    ? items.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.subCategory || "").toLowerCase().includes(q)
      )
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
    setCategoryIsNew(existingCategories.length === 0);
    setSubCategoryIsNew(false);
    setUploadError("");
    setDrawerOpen(true);
  }

  function editItem(item) {
    setForm({ ...item, subCategory: item.subCategory || "", badge: item.badge || "", imageUrl: item.imageUrl || "" });
    setEditingId(item.id);
    setCategoryIsNew(false);
    setSubCategoryIsNew(false);
    setUploadError("");
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
    closeDrawer();
    load();
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
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
    if (!confirm(`Delete ${selected.size} selected item(s)?`)) return;
    await Promise.all([...selected].map((id) => fetch(`/api/menu/${id}`, { method: "DELETE" })));
    setSelected(new Set());
    load();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <AdminGuard>
      <div className="admin-page">
        <div className="admin-toolbar">
          <h1>Menu Items</h1>
          <button className="btn" onClick={openAddForm}>+ Add Menu Item</button>
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
              placeholder="Name, category or submenu..."
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
                <th style={{ width: "38%" }} className={`sortable-th ${sortKey === "name" ? "sorted" : ""}`} onClick={() => toggleSort("name")}>
                  Name <span className="arrows"><span>▲</span><span>▼</span></span>
                </th>
                <th style={{ width: "16%" }} className={`sortable-th ${sortKey === "category" ? "sorted" : ""}`} onClick={() => toggleSort("category")}>
                  Category <span className="arrows"><span>▲</span><span>▼</span></span>
                </th>
                <th style={{ width: "16%" }} className={`sortable-th ${sortKey === "subCategory" ? "sorted" : ""}`} onClick={() => toggleSort("subCategory")}>
                  Submenu <span className="arrows"><span>▲</span><span>▼</span></span>
                </th>
                <th style={{ width: "12%" }} className={`sortable-th ${sortKey === "price" ? "sorted" : ""}`} onClick={() => toggleSort("price")}>
                  Price <span className="arrows"><span>▲</span><span>▼</span></span>
                </th>
                <th className="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((item) => (
                <tr key={item.id}>
                  <td className="col-check">
                    <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} />
                  </td>
                  <td>{item.name} {item.badge && <span className="badge">{item.badge}</span>}</td>
                  <td>{item.category}</td>
                  <td>{item.subCategory || "—"}</td>
                  <td>{item.price}</td>
                  <td className="col-actions" style={{ display: "flex", gap: 8 }}>
                    <button className="btn ghost" onClick={() => editItem(item)}>Edit</button>
                    <button className="btn ghost" onClick={() => deleteItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {pagedItems.length === 0 && (
                <tr><td colSpan={6} style={{ color: "var(--sand)", padding: "20px 8px" }}>
                  {items.length === 0 ? 'No menu items yet — click "+ Add Menu Item" to create one.' : "No items match your search."}
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
          <h3>{editingId ? "Edit item" : "Add new item"}</h3>
          <button type="button" className="admin-drawer-close" onClick={closeDrawer}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label>Price (e.g. £7.99)</label>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>

          <div className="field-with-toggle">
            <label>Category</label>
            {categoryIsNew ? (
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. burgers"
                required
                autoFocus
              />
            ) : (
              <select
                value={form.category}
                onChange={(e) => {
                  if (e.target.value === NEW_VALUE) {
                    setCategoryIsNew(true);
                    setForm({ ...form, category: "", subCategory: "" });
                  } else {
                    setForm({ ...form, category: e.target.value, subCategory: "" });
                  }
                  setSubCategoryIsNew(false);
                }}
                required
              >
                <option value="" disabled>Select category</option>
                {existingCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value={NEW_VALUE}>+ Add new category</option>
              </select>
            )}
            {categoryIsNew && existingCategories.length > 0 && (
              <button type="button" className="field-toggle-link" onClick={() => { setCategoryIsNew(false); setForm({ ...form, category: "" }); }}>
                Choose an existing category instead
              </button>
            )}
          </div>

          <div className="field-with-toggle">
            <label>Submenu (optional)</label>
            {subCategoryIsNew ? (
              <input
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                placeholder='e.g. "Classic"'
                autoFocus
              />
            ) : (
              <select
                value={form.subCategory}
                onChange={(e) => {
                  if (e.target.value === NEW_VALUE) {
                    setSubCategoryIsNew(true);
                    setForm({ ...form, subCategory: "" });
                  } else {
                    setForm({ ...form, subCategory: e.target.value });
                  }
                }}
              >
                <option value="">None</option>
                {existingSubCategories.map((s) => <option key={s} value={s}>{s}</option>)}
                <option value={NEW_VALUE}>+ Add new submenu</option>
              </select>
            )}
            {subCategoryIsNew && (
              <button type="button" className="field-toggle-link" onClick={() => { setSubCategoryIsNew(false); setForm({ ...form, subCategory: "" }); }}>
                Choose an existing submenu instead
              </button>
            )}
          </div>

          <div>
            <label>Badge (optional: NEW / POPULAR)</label>
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
          </div>
          <div>
            <label>Image URL (optional)</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://... or upload below" />
          </div>
          <div>
            <label>Upload image</label>
            <div className="upload-row">
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileChange} disabled={uploading} />
              {form.imageUrl && <img src={form.imageUrl} alt="" className="upload-preview" />}
              {uploading && <span className="upload-status">Uploading…</span>}
            </div>
            {uploadError && <p style={{ color: "#C0392B", fontSize: "0.8rem", marginTop: 6 }}>{uploadError}</p>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="submit">{editingId ? "Save changes" : "Add item"}</button>
            <button type="button" className="btn ghost" onClick={closeDrawer}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
