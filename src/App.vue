<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "App",
  computed: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  },
  created() {
    this.SET_IS_MOBILE(this._isMobile);
  },
  methods: {
    ...mapMutations("device", ["SET_IS_MOBILE"])
  }
};
</script>
