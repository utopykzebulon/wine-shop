// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import {
  fetchWines,
  createWine,
  updateWine,
  deleteWine,
  fetchAlcohols,
  createAlcohol,
  updateAlcohol,
  deleteAlcohol,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Button,
  Input,
  Select,
  InputNumber,
  Upload,
  Modal,
  Table,
  Form,
  Checkbox,
  message,
  Spin,
  Image,
} from "antd";

import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "../css/admin.css";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [productType, setProductType] = useState("wine");
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  // AntD watchers
  const wineType = Form.useWatch("type", form);
  const vintages = Form.useWatch("vintage", form) || [];
  const fileList = Form.useWatch("fileList", form) || [];

  const PLACEHOLDER =
    "https://cdn-icons-png.flaticon.com/512/1443/1443003.png";

  // Cépages dynamiques
  const GRAPES_BY_TYPE = {
    Rouge: [
      "Cabernet Sauvignon",
      "Merlot",
      "Syrah",
      "Grenache",
      "Pinot Noir",
      "Cabernet Franc",
      "Carignan",
      "Mourvèdre",
      "Malbec",
      "Cinsault",
      "Gamay",
    ],
    Blanc: [
      "Chardonnay",
      "Sauvignon Blanc",
      "Viognier",
      "Chenin Blanc",
      "Riesling",
      "Gewurztraminer",
      "Muscat",
      "Semillon",
      "Ugni Blanc",
      "Colombard",
      "Gros Manseng",
    ],
    Rosé: [
      "Grenache",
      "Cinsault",
      "Syrah",
      "Mourvèdre",
      "Cabernet Sauvignon",
      "Tibouren",
    ],
    Effervescent: [
      "Chardonnay",
      "Pinot Noir",
      "Pinot Meunier",
      "Chenin Blanc",
      "Aligoté",
    ],
  };

  // Chargement
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const [winesRes, alcoholsRes, productsRes] = await Promise.all([
        fetchWines(),
        fetchAlcohols(),
        fetchProducts(),
      ]);
      const wines = (winesRes.wines || []).map((w) => ({
        ...w,
        _kind: "wine",
      }));
      const alcohols = (alcoholsRes.alcohols || []).map((a) => ({
        ...a,
        _kind: "alcohol",
      }));
      const prods = (productsRes.products || []).map((p) => ({
        ...p,
        _kind: "product",
      }));
      setProducts([...wines, ...alcohols, ...prods]);
    } catch (err) {
      message.error("Erreur de chargement");
      setProducts([]);
    }
    setLoading(false);
  }

  // Sauvegarde
  async function handleSave(values) {
    try {
      const cleanData = {
        ...editing,
        ...values,
        image_url: values.fileList?.[0]?.url || "",
        grapes: values.grapes?.join(",") || "",
        vintage: values.vintage?.join(",") || "",
        visible_vintages: values.visible_vintages?.join(",") || "",
        price: values.price != null ? Number(values.price) : 0,
        promo_price:
          values.promo_price != null ? Number(values.promo_price) : null,
        stock: values.stock != null ? Number(values.stock) : 0,
      };

      delete cleanData.fileList;

      let res;
      if (productType === "wine") {
        res = editing
          ? await updateWine(cleanData)
          : await createWine(cleanData);
      } else if (productType === "alcohol") {
        res = editing
          ? await updateAlcohol(cleanData)
          : await createAlcohol(cleanData);
      } else {
        res = editing
          ? await updateProduct(cleanData)
          : await createProduct(cleanData);
      }

      if (res.error) message.error(res.error);
      else {
        message.success("Produit enregistré !");
        setOpenModal(false);
        setEditing(null);
        form.resetFields();
        loadProducts();
      }
    } catch (err) {
      console.error("Erreur API", err);
      message.error("Impossible d'enregistrer");
    }
  }

  // Supprimer
  async function handleDelete(record) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      if (record._kind === "wine") await deleteWine(record.id);
      else if (record._kind === "alcohol") await deleteAlcohol(record.id);
      else await deleteProduct(record.id);
      message.success("Supprimé !");
      loadProducts();
    } catch {
      message.error("Erreur suppression");
    }
  }

  // Éditer
  function handleEdit(record) {
    setProductType(record._kind);
    setEditing(record);
    form.setFieldsValue({
      ...record,
      grapes: record.grapes ? record.grapes.split(",") : [],
      vintage: record.vintage ? record.vintage.split(",") : [],
      visible_vintages: record.visible_vintages
        ? record.visible_vintages.split(",")
        : [],
      fileList: record.image_url
        ? [{ uid: "-1", name: "image", status: "done", url: record.image_url }]
        : [],
    });
    setOpenModal(true);
  }

  // Colonnes du tableau
  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image",
      render: (url) => (
        <Image
          src={url || PLACEHOLDER}
          width={60}
          height={60}
          style={{
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
          fallback={PLACEHOLDER}
          preview={false}
        />
      ),
    },
    { title: "Nom", dataIndex: "name", key: "name" },
    {
      title: "Type",
      dataIndex: "_kind",
      key: "_kind",
      render: (v) =>
        v === "wine" ? "Vin" : v === "alcohol" ? "Alcool" : "Autre",
    },
    { title: "Prix (€)", dataIndex: "price", key: "price" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </>
      ),
    },
  ];

  // Filtres
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "wine" && p._kind === "wine") ||
      (filter === "alcohol" && p._kind === "alcohol") ||
      (filter === "product" && p._kind === "product");
    return matchSearch && matchFilter;
  });

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div className="toolbar">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditing(null);
              setProductType("wine");
              setOpenModal(true);
            }}
          >
            Ajouter un produit
          </Button>
          <Input.Search
            className="search-bar"
            placeholder="Recherche…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 150, marginLeft: 10 }}
          >
            <Select.Option value="all">Tous</Select.Option>
            <Select.Option value="wine">Vins</Select.Option>
            <Select.Option value="alcohol">Alcools</Select.Option>
            <Select.Option value="product">Autres</Select.Option>
          </Select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey={(r) => `${r._kind}-${r.id}`}
            columns={columns}
            dataSource={filteredProducts}
            pagination={{ pageSize: 10 }}
          />
        )}

        {/* === Modal ajout/modif === */}
        <Modal
          title={editing ? "Modifier un produit" : "Ajouter un produit"}
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            setEditing(null);
            form.resetFields();
          }}
          footer={null}
          width={700}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item
              label="Type de produit"
              name="_kind"
              initialValue={productType}
            >
              <Select onChange={(val) => setProductType(val)}>
                <Select.Option value="wine">Vin</Select.Option>
                <Select.Option value="alcohol">Alcool</Select.Option>
                <Select.Option value="product">Autre</Select.Option>
              </Select>
            </Form.Item>

            {/* Upload Image */}
            <Form.Item
              label="Image"
              name="fileList"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload
                listType="picture"
                customRequest={({ file, onSuccess, onError, onProgress }) => {
                  const formData = new FormData();
                  formData.append("image", file);

                  const xhr = new XMLHttpRequest();
                  xhr.open(
                    "POST",
                    "http://localhost/wine-shop/backend/public/api/upload"
                  );

                  xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                      const percent = Math.round(
                        (event.loaded / event.total) * 100
                      );
                      onProgress({ percent });
                    }
                  };

                  xhr.onload = function () {
                    try {
                      const res = JSON.parse(xhr.responseText);
                      if (xhr.status === 200 && res.ok && res.url) {
                        onSuccess({ url: res.url });
                      } else {
                        onError(new Error(res.error || "Erreur serveur"));
                      }
                    } catch {
                      onError(new Error("Réponse invalide du serveur"));
                    }
                  };

                  xhr.onerror = function () {
                    onError(new Error("Erreur réseau"));
                  };

                  xhr.send(formData);
                }}
              >
                <Button icon={<UploadOutlined />}>Uploader</Button>
              </Upload>
            </Form.Item>

            {fileList.length > 0 && fileList[0].url && (
              <div className="image-preview">
                <img
                  src={fileList[0].url}
                  alt="aperçu"
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}

            {/* === Spécifiques vin === */}
            {productType === "wine" && (
              <>
                <Form.Item
                  label="Nom du vin"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Vigneron" name="winemaker">
                  <Input />
                </Form.Item>
                <Form.Item label="Cuvée" name="cuvee">
                  <Input />
                </Form.Item>
                <Form.Item label="Région" name="region">
                  <Select allowClear>
                    <Select.Option value="Provence">Provence</Select.Option>
                    <Select.Option value="Bordeaux">Bordeaux</Select.Option>
                    <Select.Option value="Bourgogne">Bourgogne</Select.Option>
                    <Select.Option value="Loire">Loire</Select.Option>
                    <Select.Option value="Rhône">Rhône</Select.Option>
                    <Select.Option value="Alsace">Alsace</Select.Option>
                    <Select.Option value="Jura">Jura</Select.Option>
                    <Select.Option value="Languedoc">Languedoc</Select.Option>
                    <Select.Option value="Corse">Corse</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Catégorie" name="type">
                  <Select allowClear>
                    <Select.Option value="Rouge">Rouge</Select.Option>
                    <Select.Option value="Blanc">Blanc</Select.Option>
                    <Select.Option value="Rosé">Rosé</Select.Option>
                    <Select.Option value="Effervescent">
                      Effervescent
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Cépages" name="grapes">
                  <Checkbox.Group options={GRAPES_BY_TYPE[wineType] || []} />
                </Form.Item>
                <Form.Item label="Millésimes" name="vintage">
                  <Select
                    mode="tags"
                    tokenSeparators={[","]}
                    placeholder="2018,2019,2020"
                  />
                </Form.Item>
                <Form.Item label="Millésimes visibles" name="visible_vintages">
                  <Select
                    mode="multiple"
                    placeholder="Choisir les millésimes à afficher"
                    options={(vintages || []).map((y) => ({
                      value: y,
                      label: y,
                    }))}
                  />
                </Form.Item>
              </>
            )}

            {/* === Alcool === */}
            {productType === "alcohol" && (
              <>
                <Form.Item label="Nom" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Producteur / Marque" name="producer">
                  <Input />
                </Form.Item>
                <Form.Item label="Catégorie" name="category">
                  <Select>
                    <Select.Option value="Whisky">Whisky</Select.Option>
                    <Select.Option value="Rhum">Rhum</Select.Option>
                    <Select.Option value="Gin">Gin</Select.Option>
                    <Select.Option value="Vodka">Vodka</Select.Option>
                    <Select.Option value="Tequila">Tequila</Select.Option>
                    <Select.Option value="Liqueur">Liqueur</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Degré (%)" name="degree">
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Volume (cl)" name="volume">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </>
            )}

            {/* === Produit générique === */}
            {productType === "product" && (
              <>
                <Form.Item label="Nom" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Catégorie" name="category">
                  <Input />
                </Form.Item>
              </>
            )}

            {/* === Champs communs === */}
            <Form.Item label="Prix (€)" name="price">
              <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Prix promo (€)" name="promo_price">
              <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Stock" name="stock">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Visible" name="visible" initialValue="1">
              <Select>
                <Select.Option value="1">Oui</Select.Option>
                <Select.Option value="0">Non</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Uniquement en magasin"
              name="in_store_only"
              initialValue="0"
            >
              <Select>
                <Select.Option value="0">Non</Select.Option>
                <Select.Option value="1">Oui</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
              <Button
                onClick={() => setOpenModal(false)}
                style={{ marginLeft: 10 }}
              >
                Annuler
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <AdminFooter />
    </>
  );
}
