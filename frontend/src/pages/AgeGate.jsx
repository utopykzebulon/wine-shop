// src/pages/AgeGate.jsx
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "../css/age.css";

export default function AgeGate() {
  const [checked, setChecked] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // Vérifie si l’utilisateur a déjà confirmé et choisi de se souvenir
  useEffect(() => {
    const consent = localStorage.getItem("ageVerified");
    if (consent === "true") {
      navigate("/boutique");
    }
  }, [navigate]);

  // Au clic sur "Entrer"
  const handleConfirm = () => {
    if (remember) {
      // Se souvenir du choix
      localStorage.setItem("ageVerified", "true");
    } else {
      // Ne pas retenir : session temporaire
      sessionStorage.setItem("ageVerified", "true");
    }
    navigate("/boutique");
  };

  return (
    <div className="agegate-wrap">
      <Card className="age-card" bordered={false}>
        <Typography.Title level={2}>Confirmez votre âge</Typography.Title>
        <Typography.Paragraph>
          Vous devez avoir 18 ans ou plus pour accéder à <br />
          <strong>La Cave de Moustiers</strong>.
        </Typography.Paragraph>

        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          style={{ marginBottom: 15 }}
        >
          Je confirme avoir l’âge légal pour consommer de l’alcool et je
          reconnais que la vente d’alcool est interdite aux mineurs.
        </Checkbox>

        <div style={{ marginBottom: 20 }}>
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={!checked}
          >
            Se souvenir de mon choix
          </Checkbox>
        </div>

        <Button
          type="primary"
          size="large"
          disabled={!checked}
          onClick={handleConfirm}
        >
          Entrer
        </Button>
      </Card>
    </div>
  );
}
