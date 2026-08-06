"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/pages", label: "Pages" },
];

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | denied
  const pathname = usePathname();

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
    return (
      <div className="admin-shell">
        <div className="admin-main">Checking session…</div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">FUSION <span>TREATS</span></div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank">View site ↗</a>
          <button
            className="btn ghost"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
          >
            Log Out
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
