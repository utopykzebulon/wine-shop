// AdminFooter.jsx
import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

export default function AdminFooter() {
  return (
    <Footer >
      <Text style={{ color: "#fff" }}>
        © 2025 La Cave de Moustiers — Panel d’administration
      </Text>
    </Footer>
  );
}
