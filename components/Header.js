import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-row justify-around text-white pt-5">
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
      <div>
        <Image
          src="/images/hamburger.png" // Bildpfad relativ zum `public`-Ordner
          alt="Logo" // Beschreibung für Barrierefreiheit
          width={30} // Bildbreite
          height={30} // Bildhöhe
        />
      </div>
    </header>
  );
}
