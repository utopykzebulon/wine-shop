import React from "react";
import { Layout } from "antd";

export default function Header({ cartCount, cartTotal }) {
  return (
    <Layout.Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        borderBottom: "1px solid #e6e3df",
        height: 64,
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 600 }}>La Cave de Moustiers</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#edeaeaff", fontWeight: 500 }}>
          {cartCount} article{cartCount > 1 ? "s" : ""}
        </span>
        <span style={{ color: "#000" }}>
          Total : <strong>{cartTotal} €</strong>
        </span>
      </div>
    </Layout.Header>
  );
}
