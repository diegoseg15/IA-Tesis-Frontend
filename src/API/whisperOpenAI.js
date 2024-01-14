// Importar la configuración de la ruta base y la versión de la API desde el archivo config.js
import { basePath, apiVersion } from "./config.js";

// Función para interactuar con la API de transcripción de Whisper mediante una solicitud POST
export function whisperTranscriptionAPI(dataWhisper) {
  // Construir la URL completa para la solicitud de transcripción a Whisper
  const url = `${basePath}/${apiVersion}/whisper/transcription`;

  // Configurar los parámetros de la solicitud HTTP
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataWhisper),
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

// Función para interactuar con la API de síntesis de voz de Whisper mediante una solicitud POST
export function whisperSpeech(dataWhisper) {
  // Construir la URL completa para la solicitud de síntesis de voz a Whisper
  const url = `${basePath}/${apiVersion}/whisper/speech`;

  // Configurar los parámetros de la solicitud HTTP de manera similar a whisperTranscriptionAPI
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataWhisper),
  };

  // Realizar la solicitud fetch y manejar la respuesta de manera similar a whisperTranscriptionAPI
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
