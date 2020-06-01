export const indexToLetter = index =>
  String.fromCharCode("A".charCodeAt(0) + index);

export const delay = async time =>
  new Promise(rs => setTimeout(_ => rs(), time));

export const requestDeviceAccess = async function() {
  let video = await getMediaStream("video");
  let audio = await getMediaStream("audio");
  return { video, audio };
};

async function getMediaStream(type) {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: type == "video",
      audio: type == "audio"
    });

    releaseStream(stream);
    return stream;
  } catch (e) {
    console.log(e);
  }
}

export function releaseStream(stream) {
  var tracks = stream.getTracks();

  for (const i of tracks) {
    i.stop();
  }
}
