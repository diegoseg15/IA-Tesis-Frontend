// Función para convertir palabras a números en un mensaje
export function wordsToNumbers(message) {
  // Convertir el mensaje a una cadena de texto y reemplazar las palabras con sus equivalentes numéricos
  const messageData = message
    .toString()
    .replace("cero", "0")
    .replace("uno", "1")
    .replace("dos", "2")
    .replace("tres", "3")
    .replace("cuatro", "4")
    .replace("cinco", "5")
    .replace("seis", "6")
    .replace("siete", "7")
    .replace("ocho", "8")
    .replace("nueve", "9");

  return messageData;
}

// Función para convertir números a palabras en un mensaje
export function NumbersToWords(message) {
  // Objeto que mapea números a sus equivalentes en palabras
  const numbers = {
    0: "cero",
    1: "uno",
    2: "dos",
    3: "tres",
    4: "cuatro",
    5: "cinco",
    6: "seis",
    7: "siete",
    8: "ocho",
    9: "nueve",
  };

  // Convertir el mensaje a minúsculas y dividirlo en palabras
  const words = message.toLowerCase().split(" ");

  // Reemplazar cada palabra con su equivalente numérico, si existe en el objeto 'numbers'
  const numericWords = words.map((word) => {
    // Verificar si la palabra está presente en el objeto 'numbers'
    if (numbers.hasOwnProperty(word)) {
      return numbers[word];
    } else {
      // Si la palabra no se encuentra en el objeto, mantenerla sin cambios
      return word;
    }
  });

  // Unir las palabras numéricas de nuevo en una oración
  const numericSentence = numericWords.join(" ");

  return numericSentence;
}
