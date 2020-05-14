/* eslint-disable*/
import axios from "axios";


export const getClassByRoomID = function(roomId) {
  return axios.get("/getClass?classId=1");
};
export const setClassByRoomID = function(body) {
  return axios.post("/setClass", body);
};

export const enterRoom = function(userId, roomId) {
  return axios.get(`/liveRoom/enter?userId=${userId}&classId=${roomId}`);
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

