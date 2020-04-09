import Vue from "vue";
import App from "./App.vue";
import VueI18n from "vue-i18n";
import router from "./router";
import { store } from "src/store/index.js";
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "zh", // 定义默认语言为中文
  messages: {
    zh: require("./i18n/zh"),

    en: require("./i18n/zh"),
  },
});
Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");
