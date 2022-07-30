export const findUrlsInText = (text) => {
    const urlRegex =
      // eslint-disable-next-line no-useless-escape
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  
    const matches = text.match(urlRegex);
  
    return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
  };
  