import Vue from "vue";
import Icon from "@/components/SvgIcon"; // svg组件

// register as a global component
Vue.component("icon", Icon);

const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context("../assets/icons", false, /\.svg$/);
requireAll(req);
