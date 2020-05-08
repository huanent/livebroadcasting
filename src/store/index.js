import Vue from "vue";
import Vuex from "vuex";
import account from "./account";
import board from "./board";
import workplace from "./workplace";
import localStream from "./localStream";
import remoteStream from "./remoteStream";
import shareScreenStream from "./shareScreenStream";
import examination from "./examination";
import electron from "./electron";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account,
    board,
    workplace,
    localStream,
    remoteStream,
    shareScreenStream,
    examination,
    electron
  }
});
