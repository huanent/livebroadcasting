/* eslint-disable*/
import axios from "axios";

export default {
  getClassList(type, pageNum, pageSize) {
    const id = localStorage.getItem("lb_token");
    return axios.get(
      `/class/list?id=${id}&type=${type}&pageNum=${pageNum}&pageSize=${pageSize}`
    );
  },
  classApply(classId) {
    const userId = localStorage.getItem("lb_userId");
    return axios.post("/class/apply", { userId, classId });
  },
  classSearch(field, value, pageNum, pageSize) {
    return axios.get(
      `/class/search?field=${field}&value=${value}&pageNum=${pageNum}&pageSize=${pageSize}`
    );
  },
  classRemove(classId) {
    const id = localStorage.getItem("lb_token");
    return axios.post("/class/remove", { classId, id });
  },
  classQuit(classId) {
    const userId = localStorage.getItem("lb_userId");
    return axios.post("/class/quit", { classId, userId });
  },
  classGet(classId) {
    return axios.get(`/class/get?classId=${classId}`);
  },
  getUserList() {
    return axios.get("/user/list");
  },
  classUpdate(formData) {
    return axios.post("/class/update", formData);
  },
  classCreate(formData) {
    return axios.post("liveRoom/create", formData);
  }
};
