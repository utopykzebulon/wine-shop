import React from "react";
import { Row, Col, Typography, Tag, Descriptions } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function WineDetail({ wine }) {
  if (!wine) return null;

  const {
    name,
    region,
    type,
    vintage,
    show_vintage,
    grapes,
    description,
    price,
    image_url,
    in_store_only,
    alc_vol,
    volume,
    producer,
    appellation,
  } = wine;

  const placeholder =
    "https://cdn-icons-png.flaticon.com/512/1443/1443003.png";

  return (
    <div className="wine-detail-modal">
      <Row gutter={[32, 24]} align="middle">
        <Col xs={24} md={10}>
          <img
            src={image_url || placeholder}
            alt={name}
            style={{
              width: "100%",
              height: 360,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Col>

        <Col xs={24} md={14}>
          <Title level={3} style={{ marginBottom: 6 }}>
            {name}
          </Title>
          <Text type="secondary">
            {region}
            {type ? ` · ${type}` : ""}
            {show_vintage && vintage ? ` · ${vintage}` : ""}
          </Text>

          <div className="detail-tags">
            {in_store_only && <Tag color="gold">Exclusivité magasin</Tag>}
            {type && <Tag>{type}</Tag>}
            {region && <Tag>{region}</Tag>}
          </div>

          <Paragraph style={{ marginTop: 12, color: "#333" }}>
            {description ||
              "Sélection soignée par notre équipe, équilibre et typicité."}
          </Paragraph>

          <Descriptions
            column={1}
            bordered
            size="small"
            items={[
              grapes && { key: "grapes", label: "Cépages", children: grapes },
              producer && { key: "prod", label: "Producteur", children: producer },
              appellation && { key: "app", label: "Appellation", children: appellation },
              volume && { key: "vol", label: "Contenance", children: volume },
              alc_vol && { key: "alc", label: "Alc./Vol", children: `${alc_vol}%` },
              price && { key: "price", label: "Prix", children: `${Number(price).toFixed(2)} €` },
            ].filter(Boolean)}
          />
        </Col>
      </Row>
    </div>
  );
}
