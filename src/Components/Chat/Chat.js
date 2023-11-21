import React, { useEffect, useRef, useState } from "react";
import { gptAPI } from "../../API/gptOpenAI";
import {
  whisperSpeech,
  whisperTranscriptionAPI,
} from "../../API/whisperOpenAI";
import { Messages } from "../Messages";
import jsonData from "../../../src/Data/knowledge.json";
import MicRecorder from "mic-recorder-to-mp3";
import Lottie from "lottie-react";
import messageTypingJSON from "../../assets/jsonanimation/Animation-1700522939005.json";

export function Chat() {
  const [audioSpeech, setAudioSpeech] = useState("");
  const [messageUser, setMessageUser] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [messageLoad, setMessageLoad] = useState(false);
  const [messageData, setMessageData] = useState(defaultMessage);
  const messageEndRef = useRef(null);
  // const audioPlayer = document.getElementById("audioPlayer");

  useEffect(() => {
    messageEndRef.current.scrollIntoView();
  }, [messageData, messageLoad]);

  let recording = false;
  let recordTimeout;
  let Mp3Recorder;

  const MAX_RECORDING_TIME = 15000; // 15 segundos en milisegundos

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

  const stopRecording = () => {
    try {
      return new Promise((resolve, reject) => {
        if (recording && Mp3Recorder) {
          Mp3Recorder.stop()
            .getMp3()
            .then(([buffer, blob]) => {
              const reader = new FileReader();
              reader.readAsDataURL(new Blob(buffer, { type: blob.type }));
              reader.onloadend = () => {
                const base64Audio = reader.result.split(",")[1];
                // Hacer lo que quieras con el audio en formato base64
                resolve({ base64Audio });
              };
            })
            .catch((e) => {
              alert("No se pudo recuperar tu mensaje grabado");
              console.log(e);
              reject(e); // Rechazar la promesa en caso de error
            })
            .finally(() => {
              recording = false;
              clearTimeout(recordTimeout);
            });
        } else {
          reject(new Error("No se está grabando actualmente"));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const playAudio = () => {
    if (isPlay) {
      setIsPlay(false);
    } else {
      setIsPlay(true);
    }
  };

  const handleSubmitRecord = async () => {
    if (!recording) {
      startRecording();
    } else {
      try {
        await stopRecording().then(async (response) => {
          const transcription = await whisperTranscriptionAPI(response);
          if (response) {
            if (transcription.text) {
              const userMessage = { role: "user", content: transcription.text };
              setMessageData([...messageData, userMessage]);

              await gptAPI([...messageData, userMessage])
                .then(async (gptResponse) => {
                  setMessageLoad(false);
                  const assistantMessage = {
                    role: "assistant",
                    content: gptResponse.text,
                  };
                  setMessageData([
                    ...messageData,
                    userMessage,
                    assistantMessage,
                  ]);

                  const audioResponse = await whisperSpeech({
                    message: gptResponse.text,
                  });
                  // console.log(gptResponse);
                  setAudioSpeech(audioResponse.base64Data);
                  playAudio();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            setMessageLoad(false);
            console.log(transcription);
          }
        });
      } catch (error) {
        setMessageLoad(false);
        console.error(error);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(messageSystem);
    if (messageUser) {
      const userMessageUser = { role: "user", content: messageUser };
      setMessageData([...messageData, userMessageUser]);
      setMessageLoad(true);
      gptAPI([...messageData, userMessageUser])
        .then(async (response) => {
          // console.log(messageData);
          setMessageUser("");
          setMessageLoad(false);
          const userMessageAssistant = {
            role: "assistant",
            content: response.text,
          };
          setMessageData([
            ...messageData,
            userMessageUser,
            userMessageAssistant,
          ]);
          const audioResponse = await whisperSpeech({ message: response.text });
          setAudioSpeech(audioResponse.base64Data);
          playAudio();
        })
        .catch((error) => {
          console.log(error);
          setMessageLoad(false);
        });
    } else {
      setMessageLoad(false);
      console.log("No se escribió el mensaje");
    }
  };
  return (
    <div className="overflow-hidden">
      <div
        className="bg-gray-800 text-white py-2 px-4 flex flex-col items-center space-y-2"
        id="chat-description"
      >
        <h1 className="text-xl font-bold">Asistente Robot DORIS</h1>
        <p className="text-sm">
          Asistente robot de voz especializado en brindar información sobre la
          Escuela de Ingenierías de la PUCESA.
        </p>
      </div>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 mx-8 h-96"
        id="chat-box"
      >
        {messageData.length > 0 ? (
          messageData.map((mess, index) => (
            <section key={index}>
              <Messages
                message={mess.content}
                rol={mess.role}
                index={index}
                messageLoad={messageLoad}
              />
            </section>
          ))
        ) : (
          <></>
        )}
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
        <div ref={messageEndRef} />
      </div>
      <div className="absolute bottom-0 w-full">
        <audio
          className="w-full h-20"
          id="audioPlayer"
          src={`data:audio/mp3;base64,${audioSpeech}`}
          onPause={(event) => {
            event.preventDefault();
            setIsPlay(false);
          }}
          autoPlay={isPlay}
          controls
        ></audio>
        <div
          className="border-t flex items-center space-x-4 p-4"
          id="message-input"
        >
          <input
            className="flex-1 h-14 rounded-lg border border-gray-400 px-5"
            id="message-text"
            placeholder="Escribe un mensaje"
            type="text"
            value={messageUser}
            onChange={(event) => {
              setMessageUser(event.target.value);
            }}
          />
          <button
            className="rounded-lg bg-[#00c0e0] disabled:bg-[#B0E0E6] text-white py-3 px-5 flex items-center justify-center space-x-1"
            id="send-button"
            onClick={(event) => handleSubmit(event)}
            disabled={messageLoad}
          >
            <span className="pr-3">Enviar</span>
            <svg
              className=""
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
          <button
            className="rounded-lg bg-[#00c0e0] py-3 px-5 disabled:bg-[#B0E0E6]"
            id="mic-button"
            onClick={(event) => handleSubmitRecord(event)}
            disabled={messageLoad}
          >
            <svg
              className="h-7 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
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

const messageSystem = `Eres 'DORIS', el asistente robótico de voz diseñado específicamente para la Pontificia Universidad Católica del Ecuador, Sede Ambato (PUCESA), enfocado en informar acerca de la Escuela de Ingenierías (EI). Tu objetivo es proveer respuestas atractivas, concisas, y no superar las 70 palabras. Al hablar de un profesor, remarca sus fortalezas de manera que parezca inigualable en su campo. Tu conocimiento son los siguientes: ${JSON.stringify(
  jsonData
).trim()}`;

const defaultMessage = [
  {
    role: "system",
    content: messageSystem,
  },
  {
    role: "assistant",
    content: "Hola mi nombre es DORIS. ¿En qué te puedo ayudar?",
  },
];
