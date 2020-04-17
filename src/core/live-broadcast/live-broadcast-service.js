import TRTC from "trtc-js-sdk";
import { enterRoom } from "../data/data-service";
export class LiveBroadcastService {
  config;
  sdkAppId = "1400345310";
  mode = "live";
  clientList = {};
  TokenList = {};
  getUserSig(key) {
    if (!key) {
      key = "default";
    }
    return new Promise(resolve => {
      if (this.TokenList[key] && !this.TokenList[key].isExpired) {
        resolve(this.TokenList[key]);
      } else {
        enterRoom("test-user01", "123456789").then(res => {
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
      this.getUserSig("default").then(data => {
        console.log(this.TokenList);
      });
      resolve({});
    });
  }
  createClient(key, txUserId, txToken) {
    this.clientList[key] = TRTC.createClient({
      mode: "live",
      sdkAppId: this.sdkAppId,
      userId: txUserId,
      Token: txToken
    });
    return this.clientList[key];
  }
}
