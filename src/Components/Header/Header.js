import React from "react";
import logo from "../../assets/logo-op3.png";

export function Header() {
  return (
    <header
      className="bg-white flex items-center justify-between py-4 px-10 text-black"
      id="header"
    >
      <img
        alt="logo"
        className="h-10"
        id="logo"
        src={logo}
        style={{
          objectFit: "cover",
        }}
      />
      
    </header>
  );
}
