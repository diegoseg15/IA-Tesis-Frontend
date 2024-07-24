<div width="100%">
    <img src="https://github.com/diegoseg15/IA-Tesis-Frontend/blob/main/src/assets/image.png?raw=true" alt="presentación de la app asistente DORIS" />
</div>

# Asistente Robot DORIS - Frontend Aplicación React

Este proyecto es una aplicación React que implementa el asistente robótico de voz DORIS. DORIS está diseñado específicamente para la Pontificia Universidad Católica del Ecuador, Sede Ambato (PUCESA), con un enfoque en proporcionar información sobre la Escuela de Ingenierías (EI).

## Contenido del Proyecto

### `src/App.js`

El archivo principal que define la estructura de la aplicación. Importa el componente `Header` y `Chat`, y los renderiza.

### `src/Components/Header.js`

El componente `Header` muestra la cabecera de la aplicación, que incluye el logo de la PUCESA.

### `src/Components/Messages.js`

El componente `Messages` se encarga de renderizar los mensajes en el chat. Dependiendo del rol del mensaje (asistente, usuario o sistema), muestra el contenido de manera diferente.

### `src/API/gptOpenAI.js`

Funciones para realizar llamadas a la API de OpenAI para obtener respuestas generadas por GPT.

### `src/API/whisperOpenAI.js`

Funciones para interactuar con la API de OpenAI para transcripciones y reproducciones de audio.

### `src/Components/Chat.js`

El componente principal `Chat` gestiona la interfaz del chat, incluyendo la entrada de mensajes, la visualización de mensajes y la reproducción de audio.

## Funcionalidades provenientes del API REST

- **Transcripción de Audio:** Permite al usuario enviar mensajes de audio que son transcritos y procesados por el asistente.
- **Generación de Respuestas:** Utiliza la API de GPT para generar respuestas inteligentes a los mensajes del usuario.
- **Interacción por Chat:** Facilita la comunicación entre el usuario y el asistente a través de mensajes de texto y audio.

**Nota:** Se recomienda ver el repositorio IA-Tesis-Backend

## Uso de Grabación de Audio

El componente `Chat` permite a los usuarios grabar mensajes de audio. Al hacer clic en el botón de micrófono (`#mic-button`), se inicia la grabación, y al hacer clic nuevamente, se detiene y se procesa la transcripción.

## Conocimientos Predeterminados

DORIS cuenta con conocimientos predeterminados sobre la Escuela de Ingenierías de la PUCESA. Estos conocimientos se encuentran en el archivo `knowledge.json` y se utilizan para mejorar las respuestas generadas por el modelo GPT. (Este archivo no se sube al repositorio por temas de seguridad)

## Cómo Iniciar la Aplicación

1. Asegúrate de tener Node.js y yarn instalados en tu sistema.
2. Instala las dependencias con el comando `yarn install`.
3. Inicia la aplicación con `yarn start`.

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000) en tu navegador.

## Mensaje de Sistema Predeterminado

El chat comienza con un mensaje de sistema que proporciona información sobre DORIS y sus capacidades. Este mensaje se encuentra en `defaultMessage` en `Chat.js`.
