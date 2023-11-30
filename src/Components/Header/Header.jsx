import React from "react";
import logo from "../../assets/logo-op3.png";

export function Header() {
  return (
    <div className="absolute w-screen">
      <header
        className="bg-white flex items-center md:justify-between py-4 px-10 text-black w-full"
        id="header"
      >
        <img
          alt="logo"
          className="h-10"
          id="logo"
          src={logo}

        />
      </header>
      <div
        className="bg-gray-800 w-full text-white py-2 px-4 flex flex-col items-center space-y-2"
        id="chat-description"
      >
        <h1 className="text-xl font-bold">Asistente Robot DORIS</h1>
        <p className="text-sm">
          Asistente robot de voz especializado en brindar información sobre la
          Escuela de Ingenierías de la PUCESA.
        </p>
      </div>
    </div>
  );
}
