import React from "react";
import "./App.css";
import { ClientLayouts } from "./Layouts/ClientLayout.jsx";
import {Chat} from "../src/Components/Chat"

function App() {
  return (
    <div id="app" className="overflow-hidden w-screen">
      <ClientLayouts>
        <Chat />
      </ClientLayouts>
    </div>
  );
}

export default App;
