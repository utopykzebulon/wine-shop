// src/components/Footer.jsx
import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="footer">
      <p>
        © {new Date().getFullYear()} La Cave de Moustiers — L’Épicerie du Coin
      </p>
      <p>
        <a href="#">Mentions légales</a> | <a href="#">Politique de confidentialité</a>
      </p>
    </AntFooter>
  );
}
