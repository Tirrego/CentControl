"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]); // Zustand für die Transaktionen
  const [loading, setLoading] = useState(true); // Zustand für das Laden
  const [error, setError] = useState(null); // Zustand für Fehler

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transaction", {
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
    <ProtectedRoute>
    <div className="pt-14 px-5">
      <h3 className="text-2xl text-white mb-6">Transaktionsübersicht</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Betrag</th>
              <th className="px-4 py-2 border-b">Transaktionstyp</th>
              <th className="px-4 py-2 border-b">Details</th>
              <th className="px-4 py-2 border-b">Erstellt am</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-700">
                <td className="px-4 py-2 border-b">{transaction.amount} €</td>
                <td className="px-4 py-2 border-b">
                  {transaction.type === "add" ? (
                    <span className="text-green-500">Einnahme</span>
                  ) : (
                    <span className="text-red-500">Ausgabe</span>
                  )}
                </td>
                <td className="px-4 py-2 border-b">{transaction.details}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </ProtectedRoute>
  );
}