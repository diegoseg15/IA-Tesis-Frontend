import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export function Messages(props) {
  const { message, rol, index, fecha } = props;

  // Verificar si el mensaje es un objeto JSON
  let transformedMessage = message;
  try {
    const parsedMessage = JSON.parse(message);
    if (typeof parsedMessage === "object" && parsedMessage.mensaje) {
      transformedMessage = parsedMessage.mensaje;
    }
  } catch (error) {
    // console.error("mensaje no se puede transformar a JSON 2");
  }

  const codeRef = useRef();

  useEffect(() => {
    // Resaltar el código utilizando highlight.js
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [transformedMessage]); // Vuelve a resaltar cuando cambia el mensaje

  // Separar bloques de código en transformedMessage encerrados en "```"
  const codeBlocks = transformedMessage.split(/(```[^`]+```)/g);

  return (
    <>
      {rol === "assistant" ? (
        <div
          className="flex flex-col items-start space-y-2 max-w-[80%]"
          id={`receiver-message-${index}`}
        >
          <div className="text-sm font-bold">DORIS</div>
          <div className="bg-gray-200 rounded-lg px-4 py-2">
            <div className="text-sm whitespace-pre-line">
              {codeBlocks.map((block, idx) => {
                const isCodeBlock =
                  block.startsWith("```") && block.endsWith("```");
                return isCodeBlock ? (
                  <pre
                    key={idx}
                    className="theme-atom-one-dark bg-slate-900 text-white px-5 py-5 mx-3 my-3 rounded-lg"
                  >
                    <code
                      ref={codeRef}
                      className={`bg-transparent ${
                        block.split(" ")[0].replace(/`/g, "")
                          ? `language-${block
                              .split(" ")[0]
                              .replace(/`/g, "")
                              .trim()}`
                          : block.split(" ")[0].replace(/`/g, "")
                      }`}
                    >
                      {block.substr(block.indexOf(" ") + 1).replace(/```/g, "")}
                    </code>
                  </pre>
                ) : (
                  <span key={idx} dangerouslySetInnerHTML={{ __html: block }} />
                );
              })}
            </div>
            <p className="text-xs text-zinc-500">{fecha[index]}</p>
          </div>
        </div>
      ) : rol === "user" ? (
        <div
          className="flex flex-col items-end space-y-2 max-w-[80%] ml-auto"
          id={`sender-message-${index}`}
        >
          <div className="text-sm font-bold">Tú</div>
          <div className="bg-[#B0E0E6] rounded-lg px-4 py-2">
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: message }}
            />
            <p className="text-xs text-zinc-500">{fecha[index]}</p>
          </div>
        </div>
      ) : (
        rol !== "system" && <>{message}</>
      )}
    </>
  );
}
