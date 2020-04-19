import TRTC from "trtc-js-sdk";
import { enterRoom } from "../data/data-service";
export class LiveBroadcastService {
  config;
  sdkAppId = "1400345310";
  mode = "live";
  clientList = {};
  TokenList = {};
  roomId = "1234567890";
  getUserSig(key) {
    if (!key) {
      key = "default";
    }
    return new Promise(resolve => {
      if (this.TokenList[key] && !this.TokenList[key].isExpired) {
        resolve(this.TokenList[key]);
      } else {
        enterRoom("test-user01", this.roomId).then(res => {
          if (res.data.success) {
            let token = Object.assign({ isExpired: false }, res.data.model);
            this.TokenList[key] = token;
            resolve(token);
          }
        });
      }
    });
  }
  init() {
    return new Promise(resolve => {
      this.getUserSig("default").then(token => {
        this.createClient("default", token.id, token.userSig);
        this.joinroom().then(() => {});
      });
    });
  }
  createClient(key, userId, userSig) {
    this.clientList[key] = TRTC.createClient({
      mode: "live",
      sdkAppId: this.sdkAppId,
      userId: userId,
      userSig: userSig
    });
    return this.clientList[key];
  }
  joinroom() {
    let token = this.TokenList["default"];
    let client = this.clientList["default"];
    let userId = token.id;
    return new Promise(resolve => {
      client
        .join({ roomId: this.roomId })
        .catch(error => {
          console.error("进房失败 " + error);
        })
        .then(() => {
          console.log("进房成功");
          const localStream = TRTC.createStream({
            userId,
            audio: true,
            video: true
          });
          localStream
            .initialize()
            .catch(error => {
              console.error("初始化本地流失败 " + error);
            })
            .then(() => {
              console.log("初始化本地流成功");
              localStream.setVideoProfile({
                width: 720, // 视频宽度
                height: 560, // 视频高度
                frameRate: 10, // 帧率
                bitrate: 400 // 比特率 kbpsy
              });
              client
                .publish(localStream)
                .catch(error => {
                  console.error("本地流发布失败 " + error);
                })
                .then(() => {
                  console.log(localStream);
                  resolve({});
                  let el = document.getElementById("local_video");
                  localStream.play(el);
                });
            });
        });
    });
  }
}
