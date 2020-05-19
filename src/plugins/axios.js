import Vue from "vue";
import axios from "axios";
import router from "../router";

axios.defaults.baseURL = "/api";
axios.defaults.timeout = 60 * 1000;

axios.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("lb_token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data  响应
    if (!response.data.success) {
      const isServerLogin =
        response.headers.islogin && response.headers.islogin === "True";
      if (!isServerLogin && router.history.current.path !== "/login") {
        router.push("/login");
      }
    }
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = axios;
  window.axios = axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios;
      }
    },
    $axios: {
      get() {
        return axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
