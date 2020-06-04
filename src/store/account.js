import store from "@/store";
import { ROLE } from "../models/role";
const state = {
  userInfo: null,
  lb_expires: "",
  lb_token: ""
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
  SET_USER_INFO(state, data) {
    state.userInfo = data;
  },
  INIT_STATE(state) {
    state.role = ROLE.STUDENT;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
