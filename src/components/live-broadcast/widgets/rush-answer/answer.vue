<template>
  <div class="rush-answer"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("widget", ["rush"])
  }
};
</script>
<style lang="scss" scoped>
.rush-answer {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
