import Vue from "vue";
import Vuex from "vuex";
import account from "./account";
import board from "./board";
import device from "./device";
import workplace from "./workplace";
import localStream from "./localStream";
import remoteStream from "./remoteStream";
import shareScreenStream from "./shareScreenStream";
import electron from "./electron";
import features from "./features";
import widget from "./widget";
import tips from "./tips";
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
    electron,
    features,
    widget,
    tips
  },
  mutations: {
    SYNC_STATE(state, payload) {
      function sync(data) {
        if (data.primaryKey) {
          let currentValue = getCurrentValue(state, data.toPath);
          let old = currentValue.findIndex(
            f => f.__primaryKey == data.primaryKey
          );

          if (old > -1) currentValue.splice(old, 1);
          data.value.__primaryKey = data.primaryKey;
          data.value.__streamId = data.streamId;
          data.value.__nickName = data.nickName;
          currentValue.splice(old, 0, data.value);
        } else {
          let lastPropName = data.path.pop();
          let currentValue = getCurrentValue(state, data.path);
          if (!currentValue) return;
          currentValue[lastPropName] = data.value;
        }
      }

      if (payload instanceof Array) {
        for (const i of payload) {
          sync(i);
        }
      } else {
        sync(payload);
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
