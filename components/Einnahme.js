"use client";
import React, { useEffect, useState } from "react";
import Button from "./Button";

function Einnahme() {
  const [accounts, setAccounts] = useState([]); // Zustand für die Konten
  const [loading, setLoading] = useState(true); // Zustand für das Laden
  const [error, setError] = useState(null); // Zustand für Fehler

  // Gesamtguthaben berechnen
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const userId = "67813eb85712ee7896043f77"; // Benutzer-ID (Beispiel)
        const response = await fetch(`/api/user/account?userId=${userId}`, {
          method: "GET", // Sicherstellen, dass die Methode GET verwendet wird
        });

        if (!response.ok) {
          throw new Error(`Fehler: ${response.status}`);
        }

        const data = await response.json();
        setAccounts(data.accounts || []); // Sicherstellen, dass accounts immer ein Array ist
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Laden abgeschlossen
      }
    }

    fetchAccounts();
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
      <h3 className="my-5 text-white">Gesamt Guthaben</h3>
      <div
        className={`flex w-80 h-24 rounded-lg bg-slate-800/50 justify-center items-center text-4xl font-bold text-[#00FF37]`}
      >
        {totalBalance} €
      </div>

      <h3 className="my-5 text-white mt-10">Kontenübersicht</h3>
      
      {/* Anzeige der Konten untereinander, nur wenn `accounts` nicht leer ist */}
      <div className="space-y-4">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account.name}
              className="flex justify-between items-center w-60 bg-slate-800/25 rounded-lg p-4"
            >
              <span className="text-white">{account.name}</span>
              <span
                className={`text-xl ${
                  account.balance >= 0 ? "text-[#00FF37]" : "text-red-500"
                }`}
              >
                {account.balance} €
              </span>
            </div>
          ))
        ) : (
          <div className="text-white">Keine Konten gefunden.</div>
        )}
      </div>

      <Button />
    </div>
  );
}

export default Einnahme;
