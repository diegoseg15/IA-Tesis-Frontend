import React from "react";


export function Messages(props) {
  const { message, rol, index } = props;

  return (
    <>
      {rol === "assistant" ? (
        <div
          className="flex flex-col items-start space-y-2 max-w-[80%]"
          id={`receiver-message-${index}`}
        >
          <div className="text-sm font-bold">DORIS</div>
          <div className="bg-gray-200 rounded-lg px-4 py-2">
            <p className="text-sm whitespace-pre-line">{message}</p>
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
