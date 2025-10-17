import React from "react";
export default function WineCard({ wine }) {
  return (
    <div className="card">
      <div className="thumb">
        <img src={wine.image_url} alt={wine.name} />
      </div>
      <div className="body">
        <h3>{wine.name}</h3>
        <p>{wine.description}</p>
        <strong>{wine.promo_price ?? wine.price} €</strong>
      </div>
    </div>
  );
}