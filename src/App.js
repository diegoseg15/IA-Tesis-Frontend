// Importar la biblioteca React para la creación de componentes
import React from "react";

// Importar la hoja de estilos principal de la aplicación
import "./App.css";

// Importar el componente 'ClientLayouts' desde el archivo correspondiente
import { ClientLayouts } from "./Layouts/ClientLayout.jsx";

// Importar el componente 'Chat' desde el archivo correspondiente
import { Chat } from "../src/Components/Chat";

// Función principal del componente 'App'
function App() {
  // Renderizar la aplicación, que incluye el diseño del cliente y el componente de chat
  return (
    <div id="app" className="overflow-hidden w-screen">
      {/* Incluir el diseño del cliente que encierra el componente de chat */}
      <ClientLayouts>
        {/* Renderizar el componente de chat dentro del diseño del cliente */}
        <Chat />
      </ClientLayouts>
    </div>
  );
}

// Exportar el componente 'App' como componente principal de la aplicación
export default App;
