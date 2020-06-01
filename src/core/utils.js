export const indexToLetter = index =>
  String.fromCharCode("A".charCodeAt(0) + index);

export const delay = async time =>
  new Promise(rs => setTimeout(_ => rs(), time));

export const requestDeviceAccess = async function() {
  let video = await getMediaStream("video");
  let audio = await getMediaStream("video");
  return { video, audio };
};

async function getMediaStream(type) {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: type == "video",
      audio: type == "audio"
    });

    var tracks = stream.getTracks();

    for (const i of tracks) {
      i.stop();
    }

    return stream;
  } catch (e) {
    console.log(e);
  }
}
