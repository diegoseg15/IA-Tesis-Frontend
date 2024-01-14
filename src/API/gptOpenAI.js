// Importar la configuración de la ruta base y la versión de la API desde el archivo config.js
import { basePath, apiVersion } from "./config.js";

// Función para interactuar con la API de generación de texto de GPT mediante una solicitud POST
export function gptAPI(dataGPT) {
  // Construir la URL completa para la solicitud a la API de generación de texto de GPT
  const url = `${basePath}/${apiVersion}/gpt/message`;

  // Configurar los parámetros de la solicitud HTTP
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataGPT),
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
