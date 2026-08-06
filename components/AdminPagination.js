"use client";

function pageNumbers(page, totalPages) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

export default function AdminPagination({ page, totalPages, pageSize, totalItems, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="admin-pagination-bar">
      <div className="admin-pagination-info">
        <span>Showing {start}–{end} of {totalItems} entries</span>
      </div>
      {totalPages > 1 && (
        <div className="admin-pagination-pages">
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹ Prev</button>
          {pageNumbers(page, totalPages).map((p, idx) =>
            p === "…" ? (
              <span key={`e${idx}`} className="admin-pagination-ellipsis">…</span>
            ) : (
              <button key={p} className={p === page ? "active" : ""} onClick={() => onPageChange(p)}>{p}</button>
            )
          )}
          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next ›</button>
        </div>
      )}
    </div>
  );
}
