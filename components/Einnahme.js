"use client";
import React, { useEffect, useState } from "react";
import Button from "./Button";

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
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Fehler: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center pt-14">
      <h3 className="my-5 text-white">Gesamt</h3>
      <div
        className={`flex w-48 h-48 rounded-full bg-slate-800/25 justify-center items-center text-3xl text-[#00FF37] ${
          guthaben > -1 ? "text-[#00FF37]" : "text-red-500"
        }`}
      >
        {guthaben} €
      </div>
      <Button />
    </div>
  );
}

export default Einnahme;
