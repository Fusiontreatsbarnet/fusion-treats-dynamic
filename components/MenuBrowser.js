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

// Matches an item's name/category/submenu against keywords to pick a themed
// placeholder icon when no real photo has been uploaded yet.
const ICON_RULES = [
  { keywords: ["burger", "cheeseburger"], icon: "🍔", gradient: "linear-gradient(135deg,#F2A65A,#D9720C)" },
  { keywords: ["fries", "tots", "tot"], icon: "🍟", gradient: "linear-gradient(135deg,#F6C453,#D9720C)" },
  { keywords: ["sandwich", "double down", "sarni"], icon: "🥪", gradient: "linear-gradient(135deg,#7FD9C4,#14A89B)" },
  { keywords: ["wing", "tender", "popcorn"], icon: "🍗", gradient: "linear-gradient(135deg,#F2A65A,#C9530E)" },
  { keywords: ["rice", "bowl"], icon: "🍚", gradient: "linear-gradient(135deg,#9BD4C4,#0F8A7F)" },
  { keywords: ["egg", "muffin", "breakfast"], icon: "🍳", gradient: "linear-gradient(135deg,#F6D976,#D9A012)" },
  { keywords: ["brisket", "beef"], icon: "🥩", gradient: "linear-gradient(135deg,#D98A6B,#8C3D1E)" },
  { keywords: ["pancake", "kunafa", "strawberr", "chocolate", "dessert", "banana"], icon: "🍰", gradient: "linear-gradient(135deg,#F2A6C4,#D9538C)" },
  { keywords: ["cooler", "water", "drink", "can"], icon: "🥤", gradient: "linear-gradient(135deg,#8FD3E8,#1FA0C9)" },
  { keywords: ["wrap"], icon: "🌯", gradient: "linear-gradient(135deg,#C4D97F,#7A9E1F)" },
  { keywords: ["salad"], icon: "🥗", gradient: "linear-gradient(135deg,#A8D98F,#3F9E2F)" },
  { keywords: ["cheese", "chilli", "mac"], icon: "🧀", gradient: "linear-gradient(135deg,#F6D976,#D9A012)" },
];
const DEFAULT_ICON = { icon: "🍽️", gradient: "linear-gradient(135deg,#9BB8B2,#3F5A54)" };

function getPlaceholder(item) {
  const text = `${item.name} ${item.category} ${item.subCategory || ""}`.toLowerCase();
  return ICON_RULES.find((rule) => rule.keywords.some((k) => text.includes(k))) || DEFAULT_ICON;
}

export function ItemCard({ item }) {
  const placeholder = !item.imageUrl ? getPlaceholder(item) : null;
  return (
    <div className="card">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
      ) : (
        <div className="menu-item-image menu-item-placeholder" style={{ background: placeholder.gradient }}>
          <span>{placeholder.icon}</span>
        </div>
      )}
      <h3>
        {item.name}
        {item.badge && <span className="badge">{item.badge}</span>}
      </h3>
      <p style={{ color: "var(--sand)", fontSize: "0.88rem", margin: "8px 0" }}>{item.description}</p>
      <span className="price">{item.price}</span>
    </div>
  );
}

export default function MenuBrowser({ items }) {
  const [filter, setFilter] = useState("all");
  const categories = [...new Set(items.map((i) => i.category))];
  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);

  // Group the visible items by submenu (only meaningful within a single category)
  const ungrouped = visible.filter((i) => !i.subCategory);
  const subGroups = [];
  const seenSub = new Map();
  for (const item of visible) {
    if (!item.subCategory) continue;
    if (!seenSub.has(item.subCategory)) {
      seenSub.set(item.subCategory, []);
      subGroups.push(item.subCategory);
    }
    seenSub.get(item.subCategory).push(item);
  }
  const hasSubmenus = filter !== "all" && subGroups.length > 0;

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

      {hasSubmenus ? (
        <div>
          {ungrouped.length > 0 && (
            <div className="menu-grid" style={{ marginBottom: 30 }}>
              {ungrouped.map((item) => <ItemCard item={item} key={item.id} />)}
            </div>
          )}
          {subGroups.map((sub) => (
            <div key={sub} style={{ marginBottom: 30 }}>
              <h3 style={{ color: "var(--turquoise)", marginBottom: 14 }}>{sub}</h3>
              <div className="menu-grid">
                {seenSub.get(sub).map((item) => <ItemCard item={item} key={item.id} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="menu-grid">
          {visible.map((item) => <ItemCard item={item} key={item.id} />)}
        </div>
      )}
    </div>
  );
}
