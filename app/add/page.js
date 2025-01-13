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
            onChange={handleAmountChange}
            type="text"
            value={amount}
          />
        </div>

        {/* Dropdown-Menü für Konten */}
        <div className="mt-4">
          <label className="text-white" htmlFor="account">
            Konto auswählen
          </label>
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          >
            <option value="" disabled>
              Bitte ein Konto auswählen
            </option>
            {accounts.map((account, index) => (
              <option key={index} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
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

        <div>
          <label className="text-white" htmlFor="details">
            Details
          </label>
          <input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            id="details"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          />
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
