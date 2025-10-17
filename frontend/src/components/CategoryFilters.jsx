import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Select, Input } from "antd";

const { Option } = Select;

/**
 * Filtres sous la CategoryBar.
 * - selectedType: "all" | "Rouge" | "Blanc" | "Rosé" | "Champagne" | "Spiritueux"
 * - onFilterChange: ({region, grape, price}) => void
 * - onSearch: (term) => void
 */
export default function CategoryFilters({
  selectedType = "all",
  onFilterChange,
  onSearch,
}) {
  const [region, setRegion] = useState("");
  const [grape, setGrape] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");

  // Cépages dynamiques selon la catégorie sélectionnée
  const grapeOptions = useMemo(() => {
    switch (selectedType) {
      case "Rouge":
        return ["Merlot", "Cabernet Sauvignon", "Syrah", "Grenache", "Pinot Noir"];
      case "Blanc":
        return ["Chardonnay", "Sauvignon", "Viognier", "Riesling", "Aligoté"];
      case "Rosé":
        return ["Cinsault", "Grenache", "Syrah", "Mourvèdre"];
      case "Champagne":
        return ["Chardonnay", "Pinot Noir", "Pinot Meunier"];
      default:
        // "all" => suggestions génériques
        return [
          "Merlot",
          "Cabernet Sauvignon",
          "Syrah",
          "Grenache",
          "Pinot Noir",
          "Chardonnay",
          "Sauvignon",
        ];
    }
  }, [selectedType]);

  // Propager les filtres
  useEffect(() => {
    onFilterChange?.({ region, grape, price });
  }, [region, grape, price, onFilterChange]);

  // Spiritueux : masquer Région & Cépage
  const isSpirit = selectedType === "Spiritueux";

  return (
    <section className="category-filters-wrap">
      <div className="filters">
        <Row gutter={[16, 16]} justify="center" align="middle">
          {!isSpirit && (
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                value={region || undefined}
                onChange={setRegion}
                style={{ width: "100%" }}
                placeholder="Région"
              >
                <Option value="Bordeaux">Bordeaux</Option>
                <Option value="Bourgogne">Bourgogne</Option>
                <Option value="Provence">Provence</Option>
                <Option value="Rhône">Rhône</Option>
                <Option value="Loire">Loire</Option>
                <Option value="Champagne">Champagne</Option>
              </Select>
            </Col>
          )}

          {!isSpirit && (
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                value={grape || undefined}
                onChange={setGrape}
                style={{ width: "100%" }}
                placeholder={
                  selectedType === "all"
                    ? "Cépages disponibles"
                    : `Cépages (${selectedType})`
                }
              >
                {grapeOptions.map((g) => (
                  <Option key={g} value={g}>
                    {g}
                  </Option>
                ))}
              </Select>
            </Col>
          )}

          <Col xs={24} sm={12} md={6}>
            <Select
              allowClear
              value={price || undefined}
              onChange={setPrice}
              style={{ width: "100%" }}
              placeholder="Prix"
            >
              <Option value="lt20">Moins de 20€</Option>
              <Option value="20-50">20€ - 50€</Option>
              <Option value="50-100">50€ - 100€</Option>
              <Option value="gt100">Plus de 100€</Option>
            </Select>
          </Col>

          <Col xs={24} sm={isSpirit ? 12 : 12} md={isSpirit ? 12 : 6}>
            <Input.Search
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Rechercher un vin..."
              className="search-input"
              allowClear
            />
          </Col>
        </Row>
      </div>
    </section>
  );
}
