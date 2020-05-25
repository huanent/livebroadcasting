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
import { autoSyncState } from "./core/state-sync";

Vue.use(element);

Vue.config.productionTip = false;

export let app = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

autoSyncState(app);
if (window.rtcService) {
  store.commit("electron/RTC_AVAIABLED");
} else {
  window.onRtcAvailable = () => {
    store.commit("electron/RTC_AVAIABLED");
  };
}
