import Vue from "vue";
import features from "./features";
import store from "@/store";
export const ROLE = {
  STUDENT: "ROLE_STUDENT",
  TEACHER: "ROLE_TEACHER"
};

Vue.prototype.ROLE = ROLE;

const state = {
  userInfo: null,
  lb_expires: "",
  lb_token: "",
  userId: "",

  role: ROLE.STUDENT, // student teacher
  site: "http://livebroadcasting.jinrui.kooboo.site"
};

const mutations = {
  SET_ROLE(state, role) {
    state.role = role;
    store.commit("features/INIT_STATE", state.role);
  },
  SET_LB_TOKEN(state, lb_token) {
    state.lb_token = lb_token;
    localStorage.setItem("lb_token", lb_token);
  },
  SET_LB_EXPIRES(state, lb_expires) {
    state.lb_expires = lb_expires;
    localStorage.setItem("lb_expires", lb_expires);
  },
  SET_TX_USERID(state, id) {
    state.userId = id;
    localStorage.setItem("lb_userId", id);
  },
  setTXPrivateMapKey(state, tx_privateMapKey) {
    state.tx_privateMapKey = tx_privateMapKey;
  },
  SET_USER_INFO(state, data) {
    state.userInfo = data;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
