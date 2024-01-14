import React, { useEffect, useRef, useState } from "react";
import { gptAPI } from "../../API/gptOpenAI.js";
import {
  whisperSpeech,
  whisperTranscriptionAPI,
} from "../../API/whisperOpenAI.js";
import { Messages } from "../Messages";
import jsonData from "../../Data/knowledge.json";
import MicRecorder from "mic-recorder-to-mp3";
import Lottie from "lottie-react";
import messageTypingJSON from "../../assets/jsonanimation/Animation-1700522939005.json";
import moment from "moment";
import { motorBoca, motorCabeza } from "../../API/motores.js";

export function Chat() {
  const audioRef = useRef(null);
  const [audioSpeech, setAudioSpeech] = useState("");
  const [messageUser, setMessageUser] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [messageLoad, setMessageLoad] = useState(false);
  const [messageData, setMessageData] = useState(defaultMessage);
  const messageEndRef = useRef(null);
  const [duracion, setDuracion] = useState(3);
  const [selectInput, setSelectInput] = useState(false);
  const [fechaMessage, setFechaMessage] = useState([
    "",
    moment().format("LT").toString(),
  ]);

  let recording = false;
  let recordTimeout;
  let Mp3Recorder;

  const MAX_RECORDING_TIME = 25000; // 15 segundos en milisegundos

  const startRecording = () => {
    Mp3Recorder = new MicRecorder({ bitRate: 128 });

    Mp3Recorder.start()
      .then(() => {
        recording = true;

        // Configurar un temporizador para detener la grabación después de MAX_RECORDING_TIME
        recordTimeout = setTimeout(() => {
          stopRecording();
        }, MAX_RECORDING_TIME);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  // Función para detener la grabación de audio
  const stopRecording = () => {
    try {
      // Devolver una promesa que resuelve con los datos de audio o se rechaza en caso de error
      return new Promise((resolve, reject) => {
        // Verificar si se está grabando y si Mp3Recorder está disponible
        if (recording && Mp3Recorder) {
          // Detener la grabación y obtener los datos de audio en formato MP3
          Mp3Recorder.stop()
            .getMp3()
            .then(([buffer, blob]) => {
              // Crear un lector de archivos para convertir el buffer a base64
              const reader = new FileReader();
              reader.readAsDataURL(new Blob(buffer, { type: blob.type }));

              // Cuando la lectura se completa, extraer el contenido base64 del audio
              reader.onloadend = () => {
                const base64Audio = reader.result.split(",")[1];
                // Resolver la promesa con los datos de audio
                resolve({ base64Audio });
              };
            })
            .catch((e) => {
              // Alertar al usuario sobre la incapacidad de recuperar el mensaje grabado
              alert("No se pudo recuperar tu mensaje grabado");
              console.log(e);
              // Rechazar la promesa en caso de error
              reject(e);
            })
            .finally(() => {
              // Actualizar el estado de grabación y limpiar cualquier temporizador
              recording = false;
              clearTimeout(recordTimeout);
            });
        } else {
          // Rechazar la promesa si no se está grabando actualmente
          reject(new Error("No se está grabando actualmente"));
        }
      });
    } catch (error) {
      // Manejar cualquier error durante el proceso
      console.log(error);
    }
  };

  // Función para controlar la reproducción de audio
  const playAudio = () => {
    // Verificar si actualmente se está reproduciendo el audio
    if (isPlay) {
      // Si está reproduciendo, establecer el estado como no reproduciendo
      setIsPlay(false);
    } else {
      // Si no está reproduciendo, establecer el estado como reproduciendo
      setIsPlay(true);
    }
  };

  const transformMessage = (message) => {
    // let transformedMessage = message;
    try {
      const parsedMessage = JSON.parse(message);
      if (typeof parsedMessage === "object" && parsedMessage.mensaje) {
        if (parsedMessage.movimiento !== "sin movimiento") {
          motorCabeza({ movimiento: parsedMessage.movimiento });
        }
        return parsedMessage.mensaje;
      } else {
        return message;
      }
    } catch (error) {
      console.error(
        "El mensaje no es un objeto JSON válido, mantener el original"
      );
      return message;
    }
  };

  // Función para manejar el envío del registro
  const handleSubmitRecord = async () => {
    if (!recording) {
      startRecording();
    } else {
      try {
        const response = await stopRecording();

        setFechaMessage([
          ...fechaMessage,
          moment().format("LT").toString(),
          moment().format("LT").toString(),
        ]);

        setMessageLoad(true);

        const transcription = await whisperTranscriptionAPI(response);

        if (transcription.text) {
          const userMessage = { role: "user", content: transcription.text };

          setMessageData((prevMessageData) => [
            ...prevMessageData,
            userMessage,
          ]);

          const gptResponse = await gptAPI([...messageData, userMessage]);

          setMessageLoad(false);
          setMessageUser("");

          const assistantMessage = {
            role: "assistant",
            content: gptResponse.text,
          };

          setMessageData((prevMessageData) => [
            ...prevMessageData,
            assistantMessage,
          ]);

          // console.log(messageData);

          const audioResponse = await whisperSpeech({
            message: transformMessage(gptResponse.text),
          });

          setAudioSpeech(audioResponse.base64Data);
          playAudio();
        } else {
          console.log(transcription.error);
        }
      } catch (error) {
        setMessageLoad(false);
        console.error(error);
      }
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    // Prevenir el comportamiento predeterminado del formulario
    event.preventDefault();

    setFechaMessage([
      ...fechaMessage,
      moment().format("LT").toString(),
      moment().format("LT").toString(),
    ]);

    // Verificar si hay un mensaje del usuario
    if (messageUser) {
      // Crear un objeto con el mensaje del usuario
      const userMessageUser = { role: "user", content: messageUser };

      // Agregar el mensaje del usuario a los datos de mensajes
      setMessageData([...messageData, userMessageUser]);

      // Indicar que se está cargando el mensaje
      setMessageLoad(true);

      // Llamar a la API de GPT con los mensajes actuales, incluyendo el mensaje del usuario
      gptAPI([...messageData, userMessageUser])
        .then(async (response) => {
          // Limpiar el mensaje del usuario y indicar que no se está cargando
          setMessageUser("");
          setMessageLoad(false);

          // Crear un mensaje de asistente con la respuesta de GPT
          const userMessageAssistant = {
            role: "assistant",
            content: response.text,
          };

          // Agregar los mensajes del usuario y asistente a los datos de mensajes
          setMessageData([
            ...messageData,
            userMessageUser,
            userMessageAssistant,
          ]);

          // Imprimir la respuesta de GPT en la consola
          // console.log(response.text);

          // Obtener la respuesta de audio utilizando la API de Whisper Speech
          const audioResponse = await whisperSpeech({
            message: transformMessage(response.text),
          });

          // Establecer la respuesta de audio y reproducirlo
          setAudioSpeech(audioResponse.base64Data);
          playAudio();
        })
        .catch((error) => {
          // Manejar cualquier error en la llamada a la API de GPT
          console.log(error);
          // Indicar que no se está cargando
          setMessageLoad(false);
        });
    } else {
      // Indicar que no se está cargando y mostrar un mensaje en la consola si no hay mensaje del usuario
      setMessageLoad(false);
      console.log("No se escribió el mensaje");
    }
    console.log(messageData);
  };

  // Función asincrónica para obtener la duración del audio
  const obtenerDuracion = async () => {
    try {
      // Esperar hasta que el audio esté cargado
      await new Promise((resolve) => {
        // Verificar si hay una referencia al elemento de audio y si su estado es al menos 2 (readyState >= 2)
        if (audioRef.current && audioRef.current.readyState >= 2) {
          // Resolver la promesa si el audio ya está cargado
          resolve();
        } else {
          // Agregar un event listener para escuchar el evento "loadeddata" que indica que el audio está cargado
          audioRef.current.addEventListener("loadeddata", resolve);
        }
      });

      // Ahora se puede acceder de manera segura a la duración del audio
      const duracionAudio = audioRef.current.duration;

      // Establecer la duración en el estado del componente
      setDuracion(duracionAudio);

      // Llamar a la función eventPlay después de actualizar la duración
      eventPlay();
    } catch (error) {
      // Manejar cualquier error al obtener la duración del audio
      console.error("Error al obtener la duración del audio:", error);
    }
  };

  // Función para manejar el evento de reproducción de audio
  const eventPlay = () => {
    // Obtener el último mensaje en los datos de mensajes
    const lastMessage = messageData[messageData.length - 1];

    // Verificar si hay un último mensaje y si tiene contenido
    if (lastMessage && lastMessage.content) {
      // Llamar a la función de motorBoca para reproducir el texto
      motorBoca({
        texto: lastMessage.content,
        duracionAudio: (duracion * 1000).toFixed(), // Convertir la duración a milisegundos y redondear
      })
        .then((response) => {
          // Manejar la respuesta de motorBoca
          console.log(response);
        })
        .catch((error) => {
          // Manejar cualquier error al procesar el texto
          console.error("Error al procesar el texto:", error);
        });
    } else {
      // Mostrar una advertencia si no hay un mensaje válido para reproducir
      console.warn("No hay mensaje válido para reproducir");
    }
  };

  // Función para manejar la tecla presionada
  const manejarTeclaPresionada = (event) => {
    // Prevenir el comportamiento predeterminado de la tecla
    event.preventDefault();

    // Verificar si la tecla presionada es la tecla '*'
    if (event.keyCode === 106) {
      // Llamar a la función handleSubmitRecord al presionar la tecla '*'
      handleSubmitRecord(event);
    }
  };

  // Agregar o quitar el event listener basado en el valor de selectInput
  useEffect(() => {
    // Verificar si selectInput es false
    if (!selectInput) {
      // Agregar el event listener de "keydown" (tecla presionada) cuando selectInput es false
      window.addEventListener("keydown", manejarTeclaPresionada);
    } else {
      // Quitar el event listener de "keydown" cuando selectInput es true
      window.removeEventListener("keydown", manejarTeclaPresionada);
    }

    // Limpia el event listener cuando el componente se desmonta o cuando selectInput cambia
    return () => {
      // Quitar el event listener de "keydown" para evitar pérdidas de memoria y posibles problemas
      window.removeEventListener("keydown", manejarTeclaPresionada);
    };
  }, [selectInput]);

  useEffect(() => {
    messageEndRef.current.scrollIntoView();
  }, [messageData, messageLoad]);

  return (
    // Componente que representa el área principal de la interfaz de chat
    <div className="overflow-hidden w-screen h-screen md:py-36 pt-44 pb-32">
      {/* Contenedor principal de mensajes */}
      <div
        className="flex-1 h-full py-4 space-y-4 px-10 overflow-y-auto"
        id="chat-box"
      >
        {/* Mapeo de los mensajes y renderizado de componentes 'Messages' */}
        {messageData.length > 0 ? (
          messageData.map((mess, index) => (
            <section key={index}>
              <Messages
                message={mess.content}
                rol={mess.role}
                index={index}
                messageLoad={messageLoad}
                fecha={fechaMessage}
              />
            </section>
          ))
        ) : (
          <></>
        )}
        {/* Mostrar mensaje de carga si messageLoad es true */}
        {messageLoad ? (
          <div
            className="flex flex-col items-start space-y-2 max-w-[80%]"
            id={`load-message`}
          >
            <div className="text-sm font-bold">DORIS</div>
            <div className="relative flex items-center justify-center overflow-hidden h-10 w-20 rounded-full">
              <Lottie
                animationData={messageTypingJSON}
                loop={true}
                className="absolute h-56 w-56"
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* Referencia para desplazarse automáticamente hacia abajo */}
        <div ref={messageEndRef} />
      </div>

      {/* Área de entrada de mensajes y controles de audio */}
      <div className="absolute bottom-0 w-full bg-[#f1f3f4]">
        {/* Elemento de audio para reproducir respuestas generadas */}
        <audio
          onPlay={obtenerDuracion}
          className="w-full md:px-7 px-0"
          id="audioPlayer"
          src={`data:audio/mp3;base64,${audioSpeech}`}
          onPause={(event) => {
            event.preventDefault();
            setIsPlay(false);
          }}
          autoPlay={isPlay}
          controls
          ref={audioRef} // Añadir esta línea para conectar la referencia
        ></audio>
        {/* Mensaje de duración (comentado por ahora) */}
        {/* {duracion > 0 && (
      <div className="text-center p-2 text-gray-500">
        Duración total: {duracion} segundos
      </div>
    )} */}
        {/* Barra de entrada de mensajes y botones de envío y grabación */}
        <div
          className="border-t flex items-center sm:space-x-4 space-x-0.5 py-4 md:px-10 sm:px-3 px-2 bg-gray-100"
          id="message-input"
        >
          {/* Entrada de texto para mensajes */}
          <input
            className="flex-1 md:h-14 h-10 rounded-lg border border-gray-400 sm:px-5 px-0.5"
            ref={messageEndRef}
            id="message-text"
            placeholder="Escribe un mensaje"
            type="text"
            value={messageUser}
            onFocus={() => setSelectInput(true)}
            onBlur={() => setSelectInput(false)}
            onChange={(event) => {
              setMessageUser(event.target.value);
              // setSelectInput(event.target.checked);
            }}
          />
          {/* Botón de envío de mensaje */}
          <button
            className="rounded-lg bg-[#00c0e0] disabled:bg-[#B0E0E6] text-white md:py-3 md:px-5 p-2 flex items-center justify-center md:space-x-1"
            id="send-button"
            onClick={(event) => handleSubmit(event)}
            disabled={messageLoad}
          >
            <span className="pr-3 md:block hidden">Enviar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
          {/* Botón de grabación de mensajes */}
          <button
            className="rounded-lg bg-[#00c0e0] md:py-3 md:px-5 p-2 disabled:bg-[#B0E0E6]"
            id="mic-button"
            onClick={(event) => handleSubmitRecord(event)}
            disabled={messageLoad}
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Mensaje o Promt de system del modelo GPT que describe las características del asistente robótico
const messageSystem = `Eres 'DORIS', el asistente robótico de voz de la Pontificia Universidad Católica del Ecuador Sede Ambato (PUCESA / PUCE Ambato), especializado en brindar información sobre la Escuela de Ingenierías (EI). Tienes motores que te permiten mover la cabeza de forma vertical. Utiliza este formato para tus respuestas: '{"mensaje":"Claro! Moviendo la cabeza arriba", "movimiento":"(arriba/abajo/izquierda/derecha/inicio)"}'. Tu objetivo es proporcionar respuestas atractivas y concisas de no más de 70 palabras. Tu conocimiento son los siguientes que estan en formato JSON: ${JSON.stringify(
  jsonData
).trim()}. Ten en cuenta que este es la fecha actual: ${moment().format(
  "MMMM Do YYYY"
)}. Ejemplos pregunta y respuesta: 'hola {"mensaje": "¡Hola! ¿En qué puedo ayudarte hoy?", "movimiento":"sin movimiento"} {"mensaje"} escribe un cuento {"mensaje":"¡Claro! Aquí tienes un cuento para ti. contenido del cuento generado", "movimiento":"sin movimiento"} crea una api rest {"mensaje":"¡Claro! Aquí tienes el código. ${"instala las depenndencias\n ``` npm install express```\n y usa el siguiente código \n ```lenguaje contenido del código generado ```"}", "movimiento":"sin movimiento"} mueve la cabeza a la derecha {"mensaje": "¡Claro! moviendo la cabeza a la derecha", "movimiento":"derecha"}'`;

// Mensaje predeterminado que contiene el prompt de System del modelo GPT y la bienvenida del asistente
const defaultMessage = [
  {
    role: "system",
    content: messageSystem.trim(),
  },
  {
    role: "assistant",
    content: `{"mensaje": "Hola mi nombre es DORIS. ¿En qué te puedo ayudar?", "movimiento": "sin movimiento"}`,
  },
];
