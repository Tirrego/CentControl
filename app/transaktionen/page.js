"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuth } from "@/lib/firebase";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]); // Zustand für die Transaktionen
  const [loading, setLoading] = useState(true); // Zustand für das Laden
  const [error, setError] = useState(null); // Zustand für Fehler

  // Authentifizierter Benutzer
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchTransactions() {
      try {
        if (!user) throw new Error("Benutzer nicht authentifiziert.");

        const userId = user.uid;

        const response = await fetch(`/api/transaction?userId=${userId}`, {
          method: "GET", // Sicherstellen, dass die Methode GET verwendet wird
        });

        if (!response.ok) {
          throw new Error(`Fehler: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data.transactions || []); // Transaktionen setzen
      } catch (err) {
        setError(err.message); // Fehler setzen
      } finally {
        setLoading(false); // Laden abgeschlossen
      }
    }

    fetchTransactions(); // Transaktionen abrufen
  }, [user]);

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
    <ProtectedRoute>
      <div className="pt-14 px-5">
        <h3 className="text-2xl text-white mb-6">Transaktionsübersicht</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-gray-800 text-white rounded-lg shadow-md p-4 flex flex-col space-y-2"
            >
              <div className="text-lg font-semibold">
                Betrag: {transaction.amount} €
              </div>
              <div className="text-lg">
                Konto: {transaction.accounts}
              </div>
              <div>
                Typ:{" "}
                {transaction.type === "add" ? (
                  <span className="text-green-500">Einnahme</span>
                ) : (
                  <span className="text-red-500">Ausgabe</span>
                )}
              </div>
              <div>
                Details: <span className="text-gray-300">{transaction.details}</span>
              </div>
              <div className="text-sm text-gray-400">
                Erstellt am:{" "}
                {new Date(transaction.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
