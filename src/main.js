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
if (window.rtcService) {
  console.log(window.rtcService);
  store.commit("electron/RTC_AVAIABLED");
} else {
  window.onRtcAvailable = () => {
    console.log(window.rtcService);
    store.commit("electron/RTC_AVAIABLED");
  };
}
