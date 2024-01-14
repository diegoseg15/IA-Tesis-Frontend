import React from "react";
import { Header } from "../Components/Header/Header";

// Componente funcional para el diseño del cliente que incluye un encabezado
export function ClientLayouts(props) {
  // Extraer el contenido secundario (children) de las propiedades
  const { children } = props;

  // Renderizar el diseño del cliente que incluye el encabezado y el contenido secundario
  return (
    <div className="overflow-hidden w-screen h-screen">
      {/* Incluir el componente de encabezado en el diseño */}
      <Header />
      {/* Mostrar el contenido secundario dentro del diseño */}
      {children}
    </div>
  );
}
