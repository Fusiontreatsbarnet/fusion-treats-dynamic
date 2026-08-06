"use client";
import { useState } from "react";

const CATEGORY_LABELS = {
  mains: "Mains & Rice Bowls",
  brisket: "Brisket Range",
  burgers: "Burgers",
  sandwiches: "Double Downs",
  wings: "Wings & Tenders",
  combos: "Combo Meals",
  breakfast: "All Day Breakfast",
  sides: "Snacks & Sides",
  desserts: "Desserts",
  drinks: "Drinks",
};

export default function MenuBrowser({ items }) {
  const [filter, setFilter] = useState("all");
  const categories = [...new Set(items.map((i) => i.category))];
  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className="menu-tabs">
        <button className={`tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {visible.map((item) => (
          <div className="card" key={item.id}>
            <h3>
              {item.name}
              {item.badge && <span className="badge">{item.badge}</span>}
            </h3>
            <p style={{ color: "var(--sand)", fontSize: "0.88rem", margin: "8px 0" }}>{item.description}</p>
            <span className="price">{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
