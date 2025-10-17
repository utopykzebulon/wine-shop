import React from "react";
import { Menu } from "antd";

/**
 * Bandeau de catégories (Tous, Rouges, Blancs, Rosés, Champagnes, Spiritueux)
 * - value: clé sélectionnée (ex: "all", "Rouge", "Blanc", ...)
 * - onChange: callback(key) quand l’utilisateur clique
 */
const CATEGORIES = [
  { key: "all", label: "Tous" },
  { key: "Rouge", label: "Rouges" },
  { key: "Blanc", label: "Blancs" },
  { key: "Rosé", label: "Rosés" },
  { key: "Champagne", label: "Champagnes" },
  { key: "Spiritueux", label: "Spiritueux" },
];

export default function CategoryBar({ value = "all", onChange }) {
  return (
    <nav className="category-menu">
      <Menu
        mode="horizontal"
        selectedKeys={[value]}
        items={CATEGORIES.map((c) => ({ key: c.key, label: c.label }))}
        onClick={(e) => onChange?.(e.key)}
        style={{
          background: "transparent",
          borderBottom: "none",
          justifyContent: "center",
        }}
      />
    </nav>
  );
}
