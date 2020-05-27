import axios from "axios";
const baseUrl = "/user";

export default {
  getUserInfo() {
    const id = localStorage.getItem("lb_token");
    return axios.get(`${baseUrl}/info?id=${id}`);
  },

  updateInfo(model) {
    const id = localStorage.getItem("lb_token");
    model.append("id", id);
    return axios.post(`${baseUrl}/update`, model);
  },

  signup(data) {
    return axios.post(`${baseUrl}/signup`, data);
  },

  login(data) {
    return axios.post(`${baseUrl}/login`, data);
  }
};
