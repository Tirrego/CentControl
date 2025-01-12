"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState("");

  // Daten vom Server abrufen
  useEffect(() => {
    fetch("/api/user/account")
      .then((res) => res.json())
      .then((data) => setAccounts(data.accounts))
      .catch((err) => console.error("Fehler beim Laden der Konten:", err));
  }, []);

  // Neues Konto hinzufügen
  const addAccount = async () => {
    if (!newAccountName) {
      alert("Bitte geben Sie einen Kontonamen ein.");
      return;
    }

    try {
      const response = await fetch("/api/user/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAccountName }),
      });

      if (!response.ok) throw new Error("Fehler beim Hinzufügen des Kontos.");

      const data = await response.json();
      setAccounts(data.accounts); // Aktualisiere die Konten
      setNewAccountName(""); // Eingabefeld zurücksetzen
    } catch (err) {
      console.error(err.message);
    }
  };

  // Konto löschen
  const deleteAccount = async (accountName) => {
    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: accountName }),
      });

      if (!response.ok) throw new Error("Fehler beim Löschen des Kontos.");

      const data = await response.json();
      setAccounts(data.accounts); // Aktualisiere die Konten
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <ProtectedRoute>
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-white mt-5">Konten</h1>

      {/* Liste der Konten */}
      <div className="w-full max-w-md">
        {accounts.map((account) => (
          <div
            key={account.name}
            className="flex justify-between items-center p-4 mb-2 bg-gray-100 rounded-md shadow-md"
          >
            <span className="font-semibold">{account.name}</span>
            <span>{account.balance.toFixed(2)} €</span>
            <button
              className="text-red-500 hover:underline"
              onClick={() => deleteAccount(account.name)}
            >
              Löschen
            </button>
          </div>
        ))}
      </div>

      {/* Neues Konto hinzufügen */}
      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Neues Konto hinzufügen</h2>
        <input
          type="text"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          placeholder="Kontoname"
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          onClick={addAccount}
        >
          Konto hinzufügen
        </button>
      </div>
    </div>
    </ProtectedRoute>
  );
}
