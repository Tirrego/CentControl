"use client"
import React, { useEffect, useState } from "react";

function Einnahme() {
  const [guthaben, setGuthaben] = useState(null); // Zustand für Guthaben
  const [loading, setLoading] = useState(true); // Zustand für das Laden
  const [error, setError] = useState(null); // Zustand für Fehler

  useEffect(() => {
    async function fetchGuthaben() {
      try {
        const userId = "67813eb85712ee7896043f77"; // Benutzer-ID (Beispiel)
        const response = await fetch(`/api/user?userId=${userId}`, {
          method: "GET", // Sicherstellen, dass die Methode GET verwendet wird
        });
  
        if (!response.ok) {
          throw new Error(`Fehler: ${response.status}`);
        }
  
        const data = await response.json();
        setGuthaben(data.guthaben); // Guthaben setzen
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Laden abgeschlossen
      }
    }
  
    fetchGuthaben();
  }, []);
  

  if (loading) {
    return <div className="text-white">Lade Benutzerdaten...</div>;
  }

  if (error) {
    return <div className="text-red-500">Fehler: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center pt-14">
      <h3 className="my-5 text-white">Gesamt</h3>
      <div className="flex w-56 h-56 rounded-full bg-slate-800/25 justify-center items-center text-4xl text-green-500">
        {guthaben} €
      </div>
      <h3 className="my-5 text-white">Ausgaben</h3>
      <div className="flex w-64 h-20 bg-slate-800/25 justify-center items-center text-4xl text-red-500">
        1000 €
      </div>
      <h3 className="my-5 text-white">Einnnahmen</h3>
      <div className="flex w-64 h-20 bg-slate-800/25 justify-center items-center text-4xl text-green-500">
        1000 €
      </div>
    </div>
  );
}

export default Einnahme;
