import axios from "axios";
const baseUrl = "/user";
const id = localStorage.getItem("lb_token");

export default {
  getUserInfo() {
    return axios.get(`${baseUrl}/info?id=${id}`);
  },

  updateInfo(model) {
    model.append("id", id);
    return axios.post(`${baseUrl}/update`, model);
  }
};
