/* eslint-disable*/
import axios from "axios";

export const getIdleToken = function(userId) {
  if (process.env.NODE_ENV === "development") {
    return getMockIdleToken();
  } else {
    return axios.get("/freeToken?userId=" + userId);
  }
};

export const getClassByRoomID = function(roomId) {
  return axios.get("/getClass?classId=1");
};
export const setClassByRoomID = function(body) {
  return axios.post("/setClass", body);
};
export const createRoom = function(appid) {
  if (process.env.NODE_ENV === "development") {
    return new Promise(resolve => {
      resolve({
        data: {
          success: true
        }
      });
    });
  } else {
    return axios.post("/createRoom", { appid });
  }
};

export const enterRoom = function(userId, roomId) {
  return axios.get(`/liveRoom/enter?userId=${userId}&classId=${roomId}`);
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

export const getCourseData = function(pageNum, pageSize, userId) {
  return axios.get(
    `/courseFile/list?pageNum=${pageNum}&pageSize=${pageSize}&userId=${userId}`
  );
};

export const removeCourseFile = function(id) {
  return axios.post("/courseFile/remove", { id });
};
export const removeClassImg = function(classId) {
  return axios.post("/liveroom/remove", { classId });
};
export const transcodeCreate = function(rawFileUrl) {
  return axios.post("/transcode/create", { url: rawFileUrl });
};
export const transcodeDescribe = function(taskId) {
  return axios.post("/transcode/describe", { taskId: taskId });
};
export const setCourseFile = function(body) {
  return axios.post("/setCourseFile", body);
};
window["initAllTokenData"] = initAllTokenData;
window["freedToken"] = freedToken;
