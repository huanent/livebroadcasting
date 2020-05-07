import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./plugins/i18n";
import "@/plugins/icons";
import element from "@c/common/element";
import "@style/normalize.css";
import "./assets/style/element-variable.scss";
import "@style/custom.scss";

import { LiveBroadcastService } from "./core/live-broadcast/live-broadcast-service";

Vue.use(element);

Vue.config.productionTip = false;

if (window.rtcService) {
  store.commit("rtcAvailabled");
} else {
  window.onRtcAvailable = () => store.commit("rtcAvailabled");
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

export const liveBroadcastService = new LiveBroadcastService();

if (process.env.NODE_ENV === "development") {
  window["liveBroadcastService"] = liveBroadcastService;
}
