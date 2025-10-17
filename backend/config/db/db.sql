-- ==============================
-- Base de données epicerie_du_coin
-- ==============================
CREATE DATABASE IF NOT EXISTS epicerie_du_coin
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE epicerie_du_coin;

-- ========== TABLES ==========

-- Admins
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vins
DROP TABLE IF EXISTS wines;
CREATE TABLE wines (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  winemaker        VARCHAR(150),
  cuvee            VARCHAR(150),
  vintage          VARCHAR(255),         -- ex: "2018,2019"
  visible_vintages VARCHAR(255),         -- ex: "2019"
  grapes           VARCHAR(255),         -- ex: "Cabernet Sauvignon,Merlot"
  region           VARCHAR(120),
  type             VARCHAR(40),          -- Rouge, Blanc, Rosé, Effervescent
  price            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  promo_price      DECIMAL(10,2),
  stock            INT DEFAULT 0,
  image_url        VARCHAR(500),
  description      TEXT,
  visible          TINYINT(1) NOT NULL DEFAULT 1,
  in_store_only    TINYINT(1) NOT NULL DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Alcools
DROP TABLE IF EXISTS alcohols;
CREATE TABLE alcohols (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  producer    VARCHAR(255) DEFAULT NULL,
  category    VARCHAR(100) DEFAULT NULL,   -- Whisky, Rhum, Gin…
  type        VARCHAR(100) DEFAULT NULL,   -- Single malt, Agricole…
  degree      DECIMAL(5,2) DEFAULT NULL,   -- % d’alcool
  volume      INT DEFAULT NULL,            -- cl
  price       DECIMAL(10,2) NOT NULL,
  promo_price DECIMAL(10,2) DEFAULT NULL,
  stock       INT NOT NULL DEFAULT 0,
  image_url   VARCHAR(500) DEFAULT NULL,
  description TEXT,
  visible     TINYINT(1) NOT NULL DEFAULT 1,
  in_store_only TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Produits
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(100) DEFAULT NULL,   -- Miel, coffret, etc.
  price       DECIMAL(10,2) NOT NULL,
  promo_price DECIMAL(10,2) DEFAULT NULL,
  stock       INT NOT NULL DEFAULT 0,
  image_url   VARCHAR(500) DEFAULT NULL,
  description TEXT,
  visible     TINYINT(1) NOT NULL DEFAULT 1,
  in_store_only TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== DONNÉES DE DÉMO ==========

-- Admin par défaut (user: admin / pass: admin123 si hash préparé)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2y$10$kCBLb3tQHY5o5c0xsKQPq.2T0n0qD63n5CkPZ9Mib2m1weqj2iD7i');

INSERT INTO wines
(name, winemaker, cuvee, vintage, grapes, region, type, price, promo_price, stock, image_url, description, visible, in_store_only, visible_vintages)
VALUES
-- 🟥 Rouges
('Château Margaux', 'Château Margaux', NULL, '2015', 'Cabernet Sauvignon, Merlot, Petit Verdot', 'Bordeaux', 'Rouge', 125.00, NULL, 6, 'https://via.placeholder.com/600x400', 'Grand cru classé de Margaux', 1, 0, '2015'),
('Domaine Tempier Bandol', 'Domaine Tempier', NULL, '2018', 'Mourvèdre, Grenache, Cinsault', 'Provence', 'Rouge', 45.00, 39.90, 12, 'https://via.placeholder.com/600x400', 'Bandol emblématique riche et charnu', 1, 0, '2018'),
('Château de Beaucastel', 'Famille Perrin', NULL, '2017,2018,2019', 'Grenache, Syrah, Mourvèdre', 'Rhône', 'Rouge', 75.00, NULL, 8, 'https://via.placeholder.com/600x400', 'Puissant et complexe, longue finale', 1, 1, '2017,2018,2019'),
('Château La Nerthe', 'Château La Nerthe', NULL, '2019', 'Grenache, Mourvèdre, Cinsault', 'Rhône', 'Rouge', 52.00, NULL, 10, 'https://via.placeholder.com/600x400', 'Châteauneuf-du-Pape soyeux et équilibré', 1, 0, '2019'),
('Clos des Papes', 'Paul Avril', NULL, '2020', 'Grenache, Syrah, Mourvèdre', 'Rhône', 'Rouge', 120.00, NULL, 4, 'https://via.placeholder.com/600x400', 'Un vin mythique de la vallée du Rhône', 1, 1, '2020'),

-- 🟨 Blancs
('Chablis Grand Cru Les Clos', 'Domaine William Fèvre', NULL, '2021', 'Chardonnay', 'Bourgogne', 'Blanc', 85.00, NULL, 7, 'https://via.placeholder.com/600x400', 'Mineralité, tension et finesse', 1, 0, '2021'),
('Puligny-Montrachet', 'Domaine Leflaive', NULL, '2020', 'Chardonnay', 'Bourgogne', 'Blanc', 110.00, NULL, 5, 'https://via.placeholder.com/600x400', 'Subtil équilibre entre fruit et bois', 1, 1, '2020'),
('Sancerre Les Monts Damnés', 'Domaine François Cotat', NULL, '2022', 'Sauvignon Blanc', 'Loire', 'Blanc', 38.00, NULL, 15, 'https://via.placeholder.com/600x400', 'Fraîcheur et élégance typiques du Sancerre', 1, 0, '2022'),
('Château Carbonnieux', 'Château Carbonnieux', NULL, '2019', 'Sauvignon, Sémillon', 'Bordeaux', 'Blanc', 42.00, NULL, 10, 'https://via.placeholder.com/600x400', 'Cru classé de Graves aux arômes floraux', 1, 0, '2019'),

-- 🩷 Rosés
('Whispering Angel', 'Château d\'Esclans', NULL, '2023', 'Grenache, Cinsault, Rolle', 'Provence', 'Rosé', 19.90, NULL, 25, 'https://via.placeholder.com/600x400', 'Rosé emblématique de Provence', 1, 0, '2023'),
('Château Minuty Prestige', 'Château Minuty', NULL, '2022', 'Grenache, Tibouren, Cinsault', 'Provence', 'Rosé', 22.50, NULL, 20, 'https://via.placeholder.com/600x400', 'Rosé frais et fruité, parfait pour l\'été', 1, 0, '2022'),
('Domaine Ott Clos Mireille', 'Domaine Ott', NULL, '2022', 'Grenache, Cinsault, Syrah', 'Provence', 'Rosé', 35.00, NULL, 12, 'https://via.placeholder.com/600x400', 'Élégance et raffinement du littoral varois', 1, 1, '2022'),

-- 🍾 Champagnes
('Moët & Chandon Impérial', 'Moët & Chandon', NULL, 'NV', 'Pinot Noir, Chardonnay, Meunier', 'Champagne', 'Champagne', 49.00, NULL, 20, 'https://via.placeholder.com/600x400', 'Bulles fines et équilibre parfait', 1, 0, 'NV'),
('Veuve Clicquot Brut', 'Veuve Clicquot', NULL, 'NV', 'Pinot Noir, Chardonnay, Meunier', 'Champagne', 'Champagne', 55.00, 49.00, 15, 'https://via.placeholder.com/600x400', 'Célèbre pour sa puissance et son élégance', 1, 0, 'NV'),
('Dom Pérignon Vintage', 'Moët & Chandon', NULL, '2013', 'Chardonnay, Pinot Noir', 'Champagne', 'Champagne', 250.00, NULL, 5, 'https://via.placeholder.com/600x400', 'Symbole d\'excellence et de prestige', 1, 1, '2013'),

-- 🥃 Spiritueux
('Glenfiddich 15 ans', 'Glenfiddich Distillery', NULL, NULL, 'Single Malt Whisky', 'Écosse', 'Spiritueux', 68.00, NULL, 10, 'https://via.placeholder.com/600x400', 'Whisky aux notes de miel et de chêne', 1, 0, ''),
('Lagavulin 16 ans', 'Lagavulin Distillery', NULL, NULL, 'Single Malt Whisky', 'Écosse', 'Spiritueux', 95.00, NULL, 8, 'https://via.placeholder.com/600x400', 'Tourbé, puissant et long en bouche', 1, 1, ''),
('Chivas Regal 18 ans', 'Chivas Brothers', NULL, NULL, 'Blended Scotch', 'Écosse', 'Spiritueux', 69.00, NULL, 9, 'https://via.placeholder.com/600x400', 'Mélange harmonieux et rond', 1, 0, ''),
('Hennessy XO', 'Hennessy', NULL, NULL, 'Cognac', 'Charente', 'Spiritueux', 199.00, NULL, 3, 'https://via.placeholder.com/600x400', 'Cognac emblématique à la richesse aromatique', 1, 1, '');
