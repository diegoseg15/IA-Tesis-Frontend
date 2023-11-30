import React from "react";
import { Header } from "../Components/Header/Header";

export function ClientLayouts(props) {
  const { children } = props;

  window.onscroll = function () {
    var y = window.scrollY;
    console.log(y);
  };

  return (
    <div className="overflow-hidden w-screen h-screen">
      <Header />
      {children}
    </div>
  );
}
