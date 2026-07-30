"use client";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | denied

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setStatus("ok");
        else {
          setStatus("denied");
          window.location.href = "/admin/login";
        }
      });
  }, []);

  if (status !== "ok") {
    return <main className="wrap" style={{ paddingTop: 100 }}>Checking session…</main>;
  }

  return (
    <div>
      <nav className="wrap" style={{ display: "flex", gap: 18, padding: "20px 0", borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
        <a href="/admin">Dashboard</a>
        <a href="/admin/menu">Menu</a>
        <a href="/admin/reviews">Reviews</a>
        <a href="/admin/pages">Pages</a>
        <a href="/" target="_blank" style={{ marginLeft: "auto" }}>View site ↗</a>
        <button
          className="btn ghost"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
        >
          Log Out
        </button>
      </nav>
      {children}
    </div>
  );
}
