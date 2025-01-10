"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [amount, SetAmount] = useState("");
  const [transactionType, setTransactionType] = useState(null); // Fügen Sie State für den Transaktionstyp hinzu
  const router = useRouter();

  // Funktion zum Absenden des Formulars
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Überprüfen, ob Betrag und Transaktionstyp ausgewählt sind
    if (!amount || !transactionType) {
      alert("Bitte gib einen Betrag ein und wähle eine Transaktion aus.");
      return;
    }

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), transactionType }), // Senden Sie auch den Transaktionstyp
      });

      if (!response.ok) {
        throw new Error("Etwas ist schiefgelaufen.");
      }

      // Navigieren Sie zurück zur Startseite nach erfolgreichem Absenden
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col max-w-sm">
        <h3 className="text-2xl text-white text-center mt-6">Transaktion</h3>
        
        <div className="mt-5">
          <label className="text-white" htmlFor="amount">
            Betrag
          </label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            id="amount"
            onChange={(e) => SetAmount(e.target.value)}
            type="number"
            value={amount}
          ></input>
        </div>

        {/* Buttons für die Auswahl des Transaktionstyps */}
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className={`${
              transactionType === "add" ? "bg-green-500" : "bg-green-200"
            } text-white py-2 px-4 rounded`}
            onClick={() => setTransactionType("add")}
          >
            Einnahme
          </button>

          <button
            type="button"
            className={`${
              transactionType === "sub" ? "bg-red-500" : "bg-red-200"
            } text-white py-2 px-4 rounded`}
            onClick={() => setTransactionType("sub")}
          >
            Ausgabe
          </button>
        </div>

        {/* Absenden Button */}
        <button
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold mt-6"
          type="submit"
        >
          Buchen
        </button>
      </form>
    </div>
  );
}
