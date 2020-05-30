export const indexToLetter = index =>
  String.fromCharCode("A".charCodeAt(0) + index);

export const delay = async time =>
  new Promise(rs => setTimeout(_ => rs(), time));

export const requestDeviceAccess = async function() {
  let video;
  let audio;

  try {
    video = await navigator.mediaDevices.getUserMedia({
      video: true
    });
  } catch (e) {
    console.log(e);
  }

  try {
    audio = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
  } catch (e) {
    console.log(e);
  }

  return { video, audio };
};
