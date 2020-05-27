export const indexToLetter = index =>
  String.fromCharCode("A".charCodeAt(0) + index);
export const delay = async time =>
  new Promise(rs => setTimeout(_ => rs(), time));
export const requestDeviceAccess = async function(preload) {
  if (!preload) {
    preload = {
      video: true,
      audio: true
    };
  }
  let videoStream;
  let audioStream;
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
  } catch (e) {}
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
  } catch (e) {}

  return { video: videoStream, audio: audioStream };
};
