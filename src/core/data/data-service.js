import axios from "axios";

import { tokenPool } from "./get-token-mock";

/*const APP_ID = "";*/

export const createRoom = function() {
  let roomId = parseInt(Math.random() * 10);
  return new Promise(resolve => {
    resolve({
      model: {
        roomId: roomId
      },
      dataChange: false,
      success: true,
      messages: [],
      fieldErrors: []
    });
  });
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

export const getIdleToken = function(userId) {
  return axios.get("/freeToken?userId=" + userId);
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
