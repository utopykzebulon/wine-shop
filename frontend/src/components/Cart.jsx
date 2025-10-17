import React from "react";
import {
  Drawer,
  List,
  Button,
  InputNumber,
  Divider,
  Empty,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Cart({ items = [], setItems, open, onClose }) {
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    message.info("Article supprimé du panier");
  };

  const total = items.reduce((acc, i) => {
    const price = Number(i.promo_price || i.price || 0);
    return acc + price * (i.qty || 1);
  }, 0);

  return (
    <Drawer
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShoppingCartOutlined /> Mon panier
        </span>
      }
      placement="right"
      width={420}
      onClose={onClose}
      open={open}
      styles={{
        header: { background: "#faf9f7", borderBottom: "1px solid #eee" },
        body: { padding: 0, background: "#fff" },
        footer: { background: "#faf9f7", borderTop: "1px solid #eee" },
      }}
      footer={
        items.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Total :
            </Title>
            <Title level={4} style={{ margin: 0, color: "#7a0010" }}>
              {total.toFixed(2)} €
            </Title>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div style={{ padding: 40 }}>
          <Empty description="Votre panier est vide" />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => {
            const price = Number(item.promo_price || item.price || 0);
            return (
              <>
                <List.Item
                  style={{
                    padding: "14px 16px",
                    alignItems: "flex-start",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  actions={[
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeItem(item.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          width={60}
                          height={60}
                          style={{
                            borderRadius: 6,
                            objectFit: "cover",
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 6,
                            background: "#f3f2ef",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#777",
                            fontSize: 12,
                          }}
                        >
                          Image
                        </div>
                      )
                    }
                    title={<strong>{item.name}</strong>}
                    description={
                      <>
                        <Text type="secondary" style={{ fontSize: "0.85rem" }}>
                          {item.region} {item.vintage && `· ${item.vintage}`}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Text
                            strong
                            style={{
                              color: "#7a0010",
                              marginRight: 6,
                              fontSize: "0.95rem",
                            }}
                          >
                            {price.toFixed(2)} €
                          </Text>
                        </div>
                      </>
                    }
                  />
                </List.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px 12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Button
                      icon={<MinusOutlined />}
                      size="small"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    />
                    <InputNumber
                      min={1}
                      value={item.qty}
                      onChange={(v) => updateQty(item.id, v)}
                      size="small"
                      style={{ width: 55, textAlign: "center" }}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    />
                  </div>
                  <Text strong>{(price * item.qty).toFixed(2)} €</Text>
                </div>
                <Divider style={{ margin: 0 }} />
              </>
            );
          }}
        />
      )}
    </Drawer>
  );
}
