<template>
  <div class="hand-up-list">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <hand-up-item :feature="item"></hand-up-item>
      </li>
    </ul>
  </div>
</template>
<script>
import HandUpItem from "./hand-up-item";
import { mapState } from "vuex";
import { HAND_UP_STATUS } from "../../../models/handUpStatus";

export default {
  components: {
    HandUpItem
  },
  computed: {
    ...mapState("workplace", ["featuresList"]),
    list() {
      return this.featuresList.filter(f => f.handUp != HAND_UP_STATUS.NONE);
    }
  }
};
</script>

<style lang="scss" scoped>
.hand-up-list {
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 100000;
  ul > li {
    padding: 3px 0;
  }
}
</style>
