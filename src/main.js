import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./plugins/i18n";
import "@/plugins/icons";
import element from "./components/common/Element/index";
import "./assets/style/element-variable.scss";
import "babel-polyfill";

Vue.use(element);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
