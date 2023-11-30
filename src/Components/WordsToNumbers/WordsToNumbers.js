export function wordsToNumbers(message) {
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

export function NumbersToWords(message) {
  const numbers = {
    0: "cero",
    1: "uno",
    2: "dos",
    3: "tres",
    4: "Cuatro",
    5: "cinco",
    6: "seis",
    7: "siete",
    8: "ocho",
    9: "nueve",
  };

  // Convert the message to lowercase and split it into words
  const words = message.toLowerCase().split(" ");

  // Replace each word with its numeric equivalent
  const numericWords = words.map((word) => {
    // Check if the word is in the 'numbers' object
    if (numbers.hasOwnProperty(word)) {
      return numbers[word];
    } else {
      // If the word is not found in the object, keep it unchanged
      return word;
    }
  });

  // Join the numeric words back into a sentence
  const numericSentence = numericWords.join(" ");

  return numericSentence;
}
