"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      setError(null); // Clear previous errors
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Registered user:", userCredential.user);
      router.push("/"); // Weiterleitung zur Startseite nach erfolgreicher Registrierung
    } catch (error) {
      console.error("Registration failed:", error.message);
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[#030E24] shadow-xl rounded-lg w-96 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Registrieren
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Erstellen Sie ein Konto, um zu starten.
        </p>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Registrieren
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Bereits ein Konto?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Anmelden
          </a>
        </p>
      </div>
    </div>
  );
}
