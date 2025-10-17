import React, { useEffect, useState } from "react";
import { fetchWines } from "../services/api";
import WineCard from "./WineCard";


export default function WineList() {
  const [wines, setWines] = useState([]);
  useEffect(() => {
    fetchWines().then(data => setWines(data.wines || []));
  }, []);

  return (
    <div className="grid">
      {wines.map(w => <WineCard key={w.id} wine={w} />)}
    </div>
  );
}