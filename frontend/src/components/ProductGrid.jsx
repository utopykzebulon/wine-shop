import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Button,
  Image,
  Modal,
  Spin,
  InputNumber,
  notification,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import Slider from "react-slick";
import { fetchWineById } from "../services/api";
import WineDetail from "../pages/WineDetail";

export default function ProductGrid({ wines = [], onAdd, mode = "grid" }) {
  const [open, setOpen] = useState(false);
  const [selectedWine, setSelectedWine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [modalQty, setModalQty] = useState(1);
  const [api, contextHolder] = notification.useNotification();
  const sliderRef = useRef(null);

  const placeholder = <div className="img-placeholder">Image à venir</div>;

  const openToast = (wine) => {
    api.success({
      message: "Ajouté au panier",
      description: `${wine.name} (${wine.qty}×) ajouté à votre panier.`,
      icon: <CheckCircleFilled style={{ color: "#7a0010" }} />,
      placement: "bottomRight",
      duration: 2.5,
    });
  };

  const handleOpen = async (wine) => {
    setModalQty(1);
    setLoading(true);
    const data = await fetchWineById(wine.id);
    setSelectedWine(data);
    setLoading(false);
    setOpen(true);
  };

  const adjustQty = (id, delta) => {
    setQuantities((prev) => {
      const newVal = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: newVal };
    });
  };

  /* === GRILLE PRODUITS (vente en ligne) === */
  if (mode === "grid") {
    return (
      <>
        {contextHolder}
        <div className="product-grid">
          {wines.map((w) => {
            const currentQty = quantities[w.id] || 1;
            return (
              <Card
                key={w.id}
                className="product-card wine-card"
                hoverable
                cover={
                  <div
                    className="wine-cover"
                    onClick={() => handleOpen(w)}
                    style={{ cursor: "pointer" }}
                  >
                    {w.image_url ? (
                      <Image
                        src={w.image_url}
                        alt={w.name}
                        preview={false}
                        height={220}
                        style={{
                          objectFit: "cover",
                          borderRadius: "6px 6px 0 0",
                        }}
                      />
                    ) : (
                      placeholder
                    )}
                  </div>
                }
              >
                <h3 onClick={() => handleOpen(w)} style={{ cursor: "pointer" }}>
                  {w.name}
                </h3>
                <p>
                  {w.region}
                  {w.type ? ` · ${w.type}` : ""}
                  {w.show_vintage && w.vintage ? ` · ${w.vintage}` : ""}
                </p>
                <strong>{w.price ? `${w.price} €` : "Prix sur demande"}</strong>

                <div className="qty-inline">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => adjustQty(w.id, -1)}
                    size="small"
                  />
                  <InputNumber
                    min={1}
                    max={99}
                    value={currentQty}
                    onChange={(v) =>
                      setQuantities((prev) => ({ ...prev, [w.id]: v || 1 }))
                    }
                    size="small"
                    style={{ width: 50, margin: "0 4px" }}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => adjustQty(w.id, +1)}
                    size="small"
                  />
                </div>

                <Button
                  type="primary"
                  block
                  onClick={() => {
                    onAdd({ ...w, qty: currentQty });
                    openToast({ ...w, qty: currentQty });
                  }}
                  style={{
                    marginTop: 8,
                    background: "#7a0010",
                    borderColor: "#7a0010",
                  }}
                >
                  Ajouter au panier
                </Button>
              </Card>
            );
          })}
        </div>

        {/* === MODAL === */}
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          centered
          width={900}
          styles={{ body: { padding: 0, overflow: "hidden" } }}
          destroyOnHidden
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <Spin size="large" />
            </div>
          ) : (
            selectedWine && (
              <div>
                <WineDetail wine={selectedWine} />
                {!selectedWine.in_store_only && (
                  <div className="modal-actions">
                    <div className="qty-wrap">
                      <span>Quantité :</span>
                      <Button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        size="small"
                      >
                        <MinusOutlined />
                      </Button>
                      <InputNumber
                        min={1}
                        max={99}
                        value={modalQty}
                        onChange={(v) => setModalQty(v || 1)}
                        style={{ width: 60, margin: "0 6px" }}
                      />
                      <Button
                        onClick={() => setModalQty((q) => q + 1)}
                        size="small"
                      >
                        <PlusOutlined />
                      </Button>
                      <Button
                        type="primary"
                        style={{
                          marginLeft: 10,
                          background: "#7a0010",
                          borderColor: "#7a0010",
                        }}
                        onClick={() => {
                          onAdd({ ...selectedWine, qty: modalQty });
                          openToast({ ...selectedWine, qty: modalQty });
                          setOpen(false);
                        }}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </Modal>
      </>
    );
  }

  /* === CARROUSEL EXCLUSIVITÉS === */
  const settings = {
    dots: false,
    arrows: false,
    infinite: wines.length > 3,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      {contextHolder}
      <section className="exclusive-carousel">
        <Button
          className="carousel-arrow left"
          icon={<LeftOutlined />}
          onClick={() => sliderRef.current?.slickPrev()}
        />
        <div
          className="exclusive-slider-wrap"
          onMouseEnter={() => sliderRef.current?.slickPause()}
          onMouseLeave={() => sliderRef.current?.slickPlay()}
        >
          <Slider ref={sliderRef} {...settings}>
            {wines.map((w) => (
              <div key={w.id} className="exclusive-slide">
                <Card
                  className="exclusive-item"
                  hoverable
                  onClick={() => handleOpen(w)}
                  cover={
                    <div className="exclusive-img">
                      {w.image_url ? (
                        <img src={w.image_url} alt={w.name} />
                      ) : (
                        <div className="exclusive-placeholder">Image à venir</div>
                      )}
                      <div className="exclusive-banner">
                        Exclusivité en boutique
                      </div>
                    </div>
                  }
                >
                  <div className="exclusive-info">
                    <h4>{w.name}</h4>
                    <p>{w.region || "Région inconnue"}</p>
                  </div>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
        <Button
          className="carousel-arrow right"
          icon={<RightOutlined />}
          onClick={() => sliderRef.current?.slickNext()}
        />
      </section>

      {/* === MODAL EXCLUSIFS === */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={900}
        styles={{ body: { padding: 0, overflow: "hidden" } }}
        destroyOnHidden
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <Spin size="large" />
          </div>
        ) : (
          selectedWine && <WineDetail wine={selectedWine} />
        )}
      </Modal>
    </>
  );
}
