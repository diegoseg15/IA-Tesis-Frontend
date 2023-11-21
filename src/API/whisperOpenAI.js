import { basePath, apiVersion } from "./config.js";

export function whisperTranscriptionAPI(dataWhisper) {
  const url = `${basePath}/${apiVersion}/whisper/transcription`;

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataWhisper),
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      // window.location.href = ("http://localhost:3000", "/error500");
      return err;
    });
}

export function whisperSpeech(dataWhisper) {
  const url = `${basePath}/${apiVersion}/whisper/speech`;

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataWhisper),
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      // window.location.href = ("http://localhost:3000", "/error500");
      return err;
    });
}
