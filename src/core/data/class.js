/* eslint-disable*/
import axios from "axios";
const id = localStorage.getItem("lb_token");
const userId = localStorage.getItem("lb_userId");

export const getClassList = function(type, pageNum, pageSize) {
  return axios.get(
    `/class/list?id=${id}&type=${type}&pageNum=${pageNum}&pageSize=${pageSize}`
  );
};
export const classApply = function(classId) {
  return axios.post("/class/apply", { userId, classId });
};
export const classSearch = function(field, value, pageNum, pageSize) {
  return axios.get(
    `/class/search?field=${field}&value=${value}&pageNum=${pageNum}&pageSize=${pageSize}`
  );
};
export const classRemove = function(classId) {
  return axios.post("/class/remove", { classId, id });
};
export const classQuit = function(classId) {
  return axios.post("/class/quit", { classId, userId });
};
export const classGet = function(classId) {
  return axios.get(`/class/get?classId=${classId}`);
};
export const getUserList = function() {
  return axios.get("/user/list");
};
export const classUpdate = function(formData) {
  return axios.post("/class/update", formData);
};
export const classCreate = function(formData) {
  return axios.post("liveRoom/create", formData);
};
