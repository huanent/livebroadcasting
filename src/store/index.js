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
import features from "./features";
import widget from "./widget";
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
    electron,
    features,
    widget
  },
  mutations: {
    SYNC_STATE(state, payload) {
      if (payload.primaryKey) {
        let currentValue = getCurrentValue(state, payload.toPath);

        let old = currentValue.findIndex(
          f => f.__primaryKey == payload.primaryKey
        );

        currentValue.splice(old, 1);
        payload.value.__primaryKey = payload.primaryKey;
        currentValue.push(payload.value);
      } else {
        let lastPropName = payload.path.pop();
        let currentValue = getCurrentValue(state, payload.path);
        if (!currentValue) return;
        currentValue[lastPropName] = payload.value;
      }
    }
  }
});

function getCurrentValue(state, path) {
  for (const i of path) {
    state = state[i];
    if (state === undefined) break;
  }

  return state;
}
