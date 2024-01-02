import React from "react";
import { wordsToNumbers } from "../WordsToNumbers/WordsToNumbers";

export function Messages(props) {
  const { message, rol, index } = props;
  // Utilizar una expresión regular para encontrar todas las instancias de ```...```
  const regex = /```([^`]+)```/g;
  let match;
  let lastIndex = 0;
  const highlightedParts = [];

  // Buscar todas las instancias de ```...```
  while ((match = regex.exec(message)) !== null) {
    const startIndex = match.index;
    const endIndex = regex.lastIndex;

    // Agregar el texto antes de ``` y después de ```
    highlightedParts.push(message.substring(lastIndex, startIndex));

    // Agregar el texto entre ``` con estilo de resaltado
    highlightedParts.push(
      <div key={startIndex} className="bg-slate-900 text-white px-5 pb-5 m-3 rounded-lg">
        {match[1]}
      </div>
    );

    lastIndex = endIndex;
  }

  // Agregar el texto restante después de la última instancia de ```
  highlightedParts.push(message.substring(lastIndex));

  return (
    <>
      {rol === "assistant" ? (
        <div
          className="flex flex-col items-start space-y-2 max-w-[80%]"
          id={`receiver-message-${index}`}
        >
          <div className="text-sm font-bold">DORIS</div>
          <div className="bg-gray-200 rounded-lg px-4 py-2">
            <p className="text-sm whitespace-pre-line">{highlightedParts}</p>
            <p className="text-xs text-zinc-500">10:15 AM</p>
          </div>
        </div>
      ) : rol === "user" ? (
        <div
          className="flex flex-col items-end space-y-2 max-w-[80%] ml-auto"
          id={`sender-message-${index}`}
        >
          <div className="text-sm font-bold">Tú</div>
          <div className="bg-[#B0E0E6] rounded-lg px-4 py-2">
            <p className="text-sm">{message}</p>
            <p className="text-xs text-zinc-500">10:16 AM</p>
          </div>
        </div>
      ) : (
        rol !== "system" && <>{message}</>
      )}
    </>
  );
}
