import { basePath, apiVersion } from "./config.js";

export function gptAPI(dataGPT) {
  const url = `${basePath}/${apiVersion}/gpt/message`;

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataGPT),
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
