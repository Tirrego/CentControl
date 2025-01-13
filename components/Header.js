"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Zustand für das Menü


  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Menü öffnen oder schließen
  };

  return (
    <header className="flex flex-row justify-between items-center text-white pt-5 px-5">
      <div>
        <Link href="/">
          <Image
            src="/images/image.png" // Bildpfad relativ zum `public`-Ordner
            alt="Logo" // Beschreibung für Barrierefreiheit
            width={50} // Bildbreite
            height={50} // Bildhöhe
          />
        </Link>
      </div>

      <div className="text-3xl">CentControl</div>

      {/* Hamburger-Icon */}
      <div onClick={toggleMenu} className="cursor-pointer">
        <Image
          src="/images/hamburger.png" // Bildpfad relativ zum `public`-Ordner
          alt="Hamburger Menu" // Beschreibung für Barrierefreiheit
          width={30} // Bildbreite
          height={30} // Bildhöhe
        />
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
          {/* Schließen-Button (X) */}
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-red-500"
          >
            X
          </button>

          <div className="flex flex-col space-y-4 text-white text-xl">
          <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="bg-green-600 hover:bg-green-700 rounded-lg py-3 px-6 text-center transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              className="bg-green-600 hover:bg-green-700 rounded-lg py-3 px-6 text-center transition-all"
            >
              Konten verwalten
            </Link>
            <Link
              href="/transaktionen"
              onClick={() => setIsMenuOpen(false)}
              className="bg-green-600 hover:bg-green-700 rounded-lg py-3 px-6 text-center transition-all"
            >
              Transaktionen
            </Link>
            <Link
              href="/transaktionen"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 rounded-lg py-3 px-6 text-center transition-all"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
