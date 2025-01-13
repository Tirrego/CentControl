"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Firebase auth importieren

export default function Page() {
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState(null);
  const [details, setDetails] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]); // Zustand für die Konten
  const [user, setUser] = useState(null); // Zustand für den aktuellen Benutzer
  const router = useRouter();

  // Überprüfe, ob der Benutzer eingeloggt ist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Benutzer setzen, wenn angemeldet
      } else {
        setUser(null); // Benutzer zurücksetzen, wenn nicht angemeldet
        alert("Bitte melde dich an!");
      }
    });

    return () => unsubscribe();
  }, []);

  // Konten laden
  useEffect(() => {
    if (user) {
      const fetchAccounts = async () => {
        try {
          const response = await fetch(`/api/user/account?userId=${user.uid}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Konten");
          }

          const data = await response.json();
          setAccounts(data.accounts || []); // Konten setzen
        } catch (err) {
          console.log(err.message);
        }
      };

      fetchAccounts();
    }
  }, [user]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !transactionType || !selectedAccount) {
      alert("Bitte gib einen Betrag ein, wähle eine Transaktion und ein Konto aus.");
      return;
    }

    if (!user) {
      alert("Bitte melde dich an!");
      return;
    }

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          amount: parseFloat(amount),
          transactionType,
          details,
          accountName: selectedAccount,
        }),
      });

      if (!response.ok) {
        throw new Error("Etwas ist schiefgelaufen.");
      }

      router.push("/"); // Weiterleitung nach erfolgreichem Absenden
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen py-12">
      <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-center mb-6">Transaktion</h3>

        {/* Betrag */}
        <div className="mb-4">
          <label className="text-white" htmlFor="amount">
            Betrag
          </label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="amount"
            onChange={handleAmountChange}
            type="text"
            value={amount}
            placeholder="Betrag eingeben"
          />
        </div>

        {/* Konto Dropdown */}
        <div className="mb-4">
          <label className="text-white" htmlFor="account">
            Konto auswählen
          </label>
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Wähle ein Konto
            </option>
            {accounts.map((account) => (
              <option key={account.name} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* Transaktionstyp */}
        <div className="mb-4 flex justify-between">
          <button
            type="button"
            className={`${
              transactionType === "add" ? "bg-green-600" : "bg-green-200"
            } text-white py-2 px-4 rounded-md hover:bg-green-500`}
            onClick={() => setTransactionType("add")}
          >
            Einnahme
          </button>

          <button
            type="button"
            className={`${
              transactionType === "sub" ? "bg-red-600" : "bg-red-200"
            } text-white py-2 px-4 rounded-md hover:bg-red-500`}
            onClick={() => setTransactionType("sub")}
          >
            Ausgabe
          </button>
        </div>

        {/* Details */}
        <div className="mb-6">
          <label className="text-white" htmlFor="details">
            Details
          </label>
          <input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            id="details"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Details zur Transaktion"
          />
        </div>

        {/* Absenden Button */}
        <button
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
          type="submit"
        >
          Buchen
        </button>
      </form>
    </div>
  );
}
