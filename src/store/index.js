import Vue from "vue";
import Vuex from "vuex";
import account, { ROLE } from "./account";
import board from "./board";
import device from "./device";
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
    device,
    workplace,
    localStream,
    remoteStream,
    shareScreenStream,
    examination,
    electron
  },
  mutations: {
    SYNC_STATE(state, payload) {
      let currentValue = state;
      let lastPropName = payload.path.pop();

      for (const i of payload.path) {
        currentValue = currentValue[i];
        if (currentValue === undefined) break;
      }

      currentValue[lastPropName] = payload.value;
    }
  }
});
