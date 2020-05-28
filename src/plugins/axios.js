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
    return response;
  },
  function(error) {
    // Do something with response error
    const statusCode = error.response.status;
    const isUnAuth = statusCode === 401 || statusCode === 403;
    const currentPath = router.history.current.path;
    if (isUnAuth && currentPath !== "/login" && currentPath !== "/signup") {
      Vue.prototype.$message.error({
        message: "身份失效，请重新登录",
        type: "error"
      });
      router.push("/login");
    }

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
