/* eslint-disable*/
import axios from "axios";

export const removeClassImg = function (classId) {
  return axios.post("/liveroom/remove", { classId });
};
export const detailInit = function (classId) {
  return axios.get("/classform/list?classId=" + classId);
};
export const updateDataInit = function (classId) {
  return axios.get("/classform/list?classId=" + classId);
};
export const getStudentsList = function () {
  return axios.get("/classform/list?students=true");
};
export const formatDate = function (timeStamp) {
  timeStamp = new Date(parseInt(timeStamp)).toLocaleString();
  return timeStamp;
};
export const classUpdate = function (formData) {
  return axios.post("/classform/update", formData);
};
export const classApply = function (formData) {
  return axios.post("/classform/apply", formData);
};
export const classCreate = function (formData) {
  return axios.post("liveRoom/create", formData);
};
export const searchClass = function (searchQuery, searchContent, pageNum) {
  if (searchQuery && searchContent) {
    return axios.get("classform/list?searchQuery=" + searchQuery + "&searchContent=" + searchContent + "&pageNum=" + pageNum);
  }
};
export const classListInit = function (activeName, pageNum) {
  var apiurl = "";
  pageNum = pageNum || 1;
  const userId = localStorage.getItem("lb_userId");
  if (!userId) return;
  if (activeName == "student") {
    apiurl = "/classform/list?isstudent=" + userId + "&pageNum=" + pageNum;
  }
  if (activeName == "teacher") {
    apiurl = "/classform/list?createUser=" + userId + "&pageNum=" + pageNum;
  }
  return axios.get(apiurl);
};
