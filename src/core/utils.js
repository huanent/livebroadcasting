export const indexToLetter = index =>
  String.fromCharCode("A".charCodeAt(0) + index);
export const delay = async time =>
  new Promise(rs => setTimeout(_ => rs(), time));
