// AdminHeader.jsx
import React from "react";
import { Layout, Typography, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

export default function AdminHeader({ onLogout }) {
  return (
    <Header

    >
      <div className="header-left">
        <Title level={3} style={{ margin: 0 }}>
          Gestion des produits
        </Title>
      </div>
      <div className="header-right">
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={onLogout}
        >
          Déconnexion
        </Button>
      </div>
    </Header>
  );
}
