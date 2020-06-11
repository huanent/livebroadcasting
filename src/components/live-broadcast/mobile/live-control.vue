<template>
  <div ref="control" class="live-control">
    <ul class="control-wrap">
      <li v-show="canControlBoard" @click="SET_VISIBLE('showBoardTool')">
        <icon name="pen4" size="100%" color="#fff"></icon>
      </li>
      <li @click="SET_VISIBLE('showSetting')">
        <icon name="settings" size="100%" color="#fff"></icon>
      </li>
      <li @click="SET_VISIBLE('showChat')">
        <icon name="comment-dots" size="100%" color="#fff"></icon>
      </li>
      <li><hand-inner /></li>
    </ul>
  </div>
</template>

<script>
import HandInner from "../hand-up/hand-inner";
import { mapMutations, mapState } from "vuex";
export default {
  name: "LiveControl",
  components: {
    HandInner
  },
  methods: {
    ...mapMutations("mobile", ["SET_VISIBLE"])
  },
  computed: {
    ...mapState("features", ["canControlBoard"])
  }
};
</script>

<style lang="scss" scoped>
.live-control {
  position: absolute;
  right: 0.5rem;
  top: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  .control-wrap {
    > li {
      pointer-events: all;
      padding: 0.3rem;
      margin: 0.8rem;
      background-color: #242c2c;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      & > * {
        transform: scale(0.7);
      }
    }
  }
}
</style>
