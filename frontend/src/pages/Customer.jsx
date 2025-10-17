import React, { useState, useEffect } from "react";
import {
  Layout,
  Spin,
  Typography,
  notification,
  FloatButton,
  Badge,
} from "antd";
import { ShoppingCartOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchWines } from "../services/api";

import Header from "../components/Header";
import BannerIntro from "../components/BannerIntro";
import CategoryBar from "../components/CategoryBar";        // ⬅️ nouveau
import CategoryFilters from "../components/CategoryFilters";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

import "../css/main.css";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Customer() {
  const navigate = useNavigate();
  const [wines, setWines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");   // ⬅️ gère la catégorie
  const [criteria, setCriteria] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const openToast = (wine) => {
    api.success({
      message: "Ajouté au panier",
      description: `${wine.name} (${wine.qty || 1}×) ajouté à votre panier.`,
      icon: <CheckCircleFilled style={{ color: "#7a0010" }} />,
      placement: "bottomRight",
      duration: 2.5,
    });
  };

  useEffect(() => {
    const local = localStorage.getItem("ageVerified");
    const session = sessionStorage.getItem("ageVerified");
    if (local !== "true" && session !== "true") navigate("/");
  }, [navigate]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchWines();
      const list = data.wines || [];
      setWines(list);
      setFiltered(list);
      setLoading(false);
    }
    load();
  }, []);

  // Filtrage combiné
  useEffect(() => {
    let list = [...wines];
    if (selectedType && selectedType !== "all")
      list = list.filter((w) => w.type === selectedType);
    if (criteria.region)
      list = list.filter((w) => w.region === criteria.region);
    if (criteria.grape)
      list = list.filter((w) =>
        (w.grapes || "").toLowerCase().includes(criteria.grape.toLowerCase())
      );
    if (criteria.price) {
      if (criteria.price === "lt20") list = list.filter((w) => w.price < 20);
      if (criteria.price === "20-50")
        list = list.filter((w) => w.price >= 20 && w.price <= 50);
      if (criteria.price === "50-100")
        list = list.filter((w) => w.price >= 50 && w.price <= 100);
      if (criteria.price === "gt100") list = list.filter((w) => w.price > 100);
    }
    if (searchTerm.trim() !== "")
      list = list.filter((w) =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFiltered(list);
  }, [criteria, selectedType, wines, searchTerm]);

  const addToCart = (wine) => {
    if (wine.in_store_only) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === wine.id);
      if (existing) {
        const updated = prev.map((i) =>
          i.id === wine.id ? { ...i, qty: i.qty + 1 } : i
        );
        openToast({ ...wine, qty: existing.qty + 1 });
        return updated;
      }
      openToast({ ...wine, qty: 1 });
      return [...prev, { ...wine, qty: 1 }];
    });
  };

  const exclusiveWines = filtered.filter((w) => Number(w.in_store_only) === 1);
  const sellableWines = filtered.filter((w) => !Number(w.in_store_only));

  // Animation "fade-in" de la grille à chaque changement de catégorie
  const triggerGridFade = () => {
    const grid = document.querySelector(".main-grid");
    if (grid) {
      grid.classList.remove("fade-in");
      void grid.offsetWidth; // reflow
      grid.classList.add("fade-in");
    }
  };

  return (
    <Layout>
      {contextHolder}
      <Header cartCount={cart.length} />
      <Content style={{ background: "#faf9f7" }}>
        <BannerIntro />

        {/* Bandeau Catégories */}
        <CategoryBar
          value={selectedType}
          onChange={(type) => {
            setSelectedType(type);
            triggerGridFade();
          }}
        />

        {/* Filtres alignés et synchronisés avec la catégorie */}
        <CategoryFilters
          selectedType={selectedType}
          onFilterChange={setCriteria}
          onSearch={setSearchTerm}
        />

        {/* Résumé */}
        <div className="result-summary container">
          <Text type="secondary">
            {filtered.length} vin{filtered.length > 1 ? "s" : ""} trouvé
            {criteria.region ? ` · ${criteria.region}` : ""}
            {selectedType !== "all" ? ` · ${selectedType}` : ""}
            {searchTerm ? ` · "${searchTerm}"` : ""}
          </Text>
        </div>

        {/* Exclusivités magasin */}
        {!loading && exclusiveWines.length > 0 && (
          <div className="exclusive-wrapper">
            <Title
              level={3}
              style={{
                color: "#7a0010",
                textAlign: "center",
                marginTop: 40,
                marginBottom: 20,
              }}
            >
              Vins disponibles uniquement en magasin
            </Title>
            <ProductGrid wines={exclusiveWines} mode="exclusive" />
          </div>
        )}

        {/* Vente en ligne */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="container main-grid">
            <Title
              level={3}
              style={{
                color: "#7a0010",
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              Vins disponibles à la vente en ligne
            </Title>
            <ProductGrid wines={sellableWines} onAdd={addToCart} />
          </div>
        )}
      </Content>

      <Cart
        items={cart}
        setItems={setCart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
      <Footer />

      {/* Bouton panier flottant (AntD) déjà en place dans ta version précédente */}
      <Badge
        count={cart.length}
        offset={[-8, 6]}
        style={{
          backgroundColor: "#c5a55a",
          color: "#fff",
          boxShadow: "0 0 0 1px #fff",
        }}
      >
        <FloatButton
          shape="circle"
          type="primary"
          icon={<ShoppingCartOutlined />}
          style={{
            right: 25,
            bottom: 25,
            backgroundColor: "#7a0010",
            borderColor: "#7a0010",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          }}
          onClick={() => setCartOpen(true)}
        />
      </Badge>
    </Layout>
  );
}
