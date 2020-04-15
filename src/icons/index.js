import Vue from "vue";
import SvgIcon from "@/components/common/SvgIcon"; // svg组件

// register as a global component
Vue.component("svg-icon", SvgIcon);

const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
const req = require.context("./svg", false, /\.svg$/);
requireAll(req);
