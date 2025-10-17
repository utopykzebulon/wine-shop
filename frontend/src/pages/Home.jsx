import React from "react";
import WineList from "../components/WineList";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "antd/dist/reset.css";


export default function Home() {
  return (
    <div className="container">
      <h1>Notre sélection de vins</h1>
      <WineList />
    </div>
  );
}