"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [amount, SetAmount] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(amount);

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount)}),
      });
    } catch (error) {
      console.log(error);
    }

    router.push("/");
  }
    return (
      <div className="flex flex-row justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-white">Betrag:</label>
          <input
            onChange={(e) => SetAmount(e.target.value)}
            type="number"
            value={amount}
          ></input>
          <button
            className="w-full p-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
            type="submit"
          >
            Absenden
          </button>
        </form>
      </div>
    );
  };

