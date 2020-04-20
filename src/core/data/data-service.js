/* eslint-disable*/
import axios from "axios";

import {
  createRoomMock,
  getMockIdleToken,
  getSdkAppIdMock,
  tokenPool
} from "./get-token-mock";

/*const APP_ID = "1400345310";*/

export const getIdleToken = function(userId) {
  if (process.env.NODE_ENV === "development") {
    return getMockIdleToken();
  } else {
    return axios.get("/freeToken?userId=" + userId);
  }
};
export const createRoom = function(appid) {
  if (process.env.NODE_ENV === "development") {
    return createRoomMock(appid);
  } else {
    return axios.post("/createRoom", { appid });
  }
};
export const getSdkAppId = function() {
  if (process.env.NODE_ENV === "development") {
    return getSdkAppIdMock();
  } else {
  }
};

export const enterRoom = function(userId, roomId) {
  return new Promise(resolve => {
    getIdleToken(userId).then(res => {
      resolve({
        data: {
          model: {
            id: res.data.model["tx_user_id"],
            userSig: res.data.model["tx_token"],
            privateMapKey: Math.random() * 10
          },
          dataChange: false,
          success: true,
          messages: [],
          fieldErrors: []
        }
      });
    });
  });
};
export const destroyRoom = function(roomId) {
  return new Promise(resolve => {
    resolve({
      model: {},
      dataChange: false,
      success: true,
      messages: [],
      fieldErrors: []
    });
  });
};

export const initAllTokenData = function() {
  axios
    .post("/postAllToken", {
      data: tokenPool
    })
    .then(res => {
      console.log(res.data);
    });
};

export const updataTokenById = function(id, item) {
  item.id = id;
  return axios.post("/token/post", item);
};

export const freedToken = function(id) {
  return new Promise(resolve => {
    updataTokenById(id, { state: "0", user_id: "" }).then(res => {
      console.log(res);
      resolve({
        success: true
      });
    });
  });
};

window["initAllTokenData"] = initAllTokenData;
window["freedToken"] = freedToken;
