// Importar la configuración de la ruta base y la versión de la API desde el archivo config.js
import { basePath, apiVersion } from "./config.js";

// Función para interactuar con el motor de boca a través de una solicitud POST
export function motorBoca(dataBoca) {
  // Construir la URL completa para la solicitud al motor de boca
  const url = `${basePath}/${apiVersion}/boca`;

  // Configurar los parámetros de la solicitud HTTP
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataBoca),
  };

  // Realizar la solicitud fetch y manejar la respuesta
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

// Función para interactuar con el motor de cabeza a través de una solicitud POST
export function motorCabeza(dataCabeza) {
  // Construir la URL completa para la solicitud al motor de cabeza
  const url = `${basePath}/${apiVersion}/cabeza`;

  // Configurar los parámetros de la solicitud HTTP
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataCabeza),
  };

  // Realizar la solicitud fetch y manejar la respuesta de manera similar a motorBoca
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}
