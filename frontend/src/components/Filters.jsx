import React, { useState, useEffect } from "react";
import { Select, Row, Col } from "antd";

const { Option } = Select;

export default function Filters({ onChange }) {
  const [filters, setFilters] = useState({
    region: "",
    grape: "",
    price: "",
  });

  useEffect(() => {
    onChange(filters);
  }, [filters]);

  return (
    <div className="filters">
      <Row gutter={[16, 16]} justify="center">
        {/* Région */}
        <Col xs={24} sm={8}>
          <Select
            placeholder="Région"
            allowClear
            value={filters.region || undefined}
            onChange={(v) => setFilters((f) => ({ ...f, region: v || "" }))}
            style={{ width: "100%" }}
          >
            {[
              "Alsace", "Beaujolais", "Bordeaux", "Bourgogne", "Champagne",
              "Corse", "Jura", "Languedoc", "Loire", "Provence", "Roussillon",
              "Savoie", "Sud-Ouest", "Rhône",
            ].map((r) => (
              <Option key={r} value={r}>{r}</Option>
            ))}
          </Select>
        </Col>

        {/* Cépage */}
        <Col xs={24} sm={8}>
          <Select
            placeholder="Cépage"
            showSearch
            allowClear
            value={filters.grape || undefined}
            onChange={(v) => setFilters((f) => ({ ...f, grape: v || "" }))}
            style={{ width: "100%" }}
          >
            {[
              "Grenache", "Syrah", "Mourvèdre", "Carignan", "Cinsault", "Merlot",
              "Cabernet Sauvignon", "Cabernet Franc", "Pinot Noir", "Gamay",
              "Malbec", "Tannat", "Chardonnay", "Sauvignon Blanc", "Sémillon",
              "Chenin Blanc", "Viognier", "Marsanne", "Roussanne", "Ugni Blanc",
              "Colombard", "Gewurztraminer", "Riesling", "Muscat",
            ].map((g) => (
              <Option key={g} value={g}>{g}</Option>
            ))}
          </Select>
        </Col>

        {/* Prix */}
        <Col xs={24} sm={8}>
          <Select
            placeholder="Prix"
            allowClear
            value={filters.price || undefined}
            onChange={(v) => setFilters((f) => ({ ...f, price: v || "" }))}
            style={{ width: "100%" }}
          >
            <Option value="lt20">Moins de 20€</Option>
            <Option value="20-50">20 € – 50 €</Option>
            <Option value="50-100">50 € – 100 €</Option>
            <Option value="gt100">Plus de 100 €</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
}
