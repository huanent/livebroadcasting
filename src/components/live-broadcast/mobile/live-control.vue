<template>
  <div
    ref="control"
    class="live-control"
    v-panend="onPanend"
    v-panmove="onPanmove"
    :style="{
      right: originRight + offsetRight + 'px',
      top: originTop + offsetTop + 'px'
    }"
  >
    <ul class="control-wrap">
      <li v-show="canControlBoard">
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
  data: () => ({
    title: "hello",
    offsetRight: 0,
    offsetTop: 0,
    originRight: 0,
    originTop: 0
  }),
  components: {
    HandInner
  },
  mounted() {
    this.initToolBarPosition();
  },
  methods: {
    ...mapMutations("mobile", ["SET_VISIBLE"]),
    onPanend() {
      // this.originRight += this.offsetRight;
      // this.originTop += this.offsetTop;
      // this.offsetRight = 0;
      // this.offsetTop = 0;
    },
    onPanmove(e) {
      // let { deltaX, deltaY } = e;
      // if (
      //   !this.checkEdge(-deltaX + this.originRight, deltaY + this.originTop)
      // ) {
      //   this.offsetRight = -deltaX;
      //   this.offsetTop = deltaY;
      // }
    },
    initToolBarPosition(isFix) {
      let el = this.$refs.control;
      if (el) {
        let parentEl = el.parentElement;
        let ph = parentEl.getBoundingClientRect().height;
        let h = el.getBoundingClientRect().height;
        this.originTop = ph / 2 - h / 2;
        if (!isFix) {
          this.originRight = 0;
        }

        if (this.toolHight < el.clientHeight) {
          this.toolHight = el.clientHeight;
          this.originTop = (ph - this.toolHight) / 2;
        }
      }
    },
    checkEdge(right, top) {
      let odiv = this.$refs.control;
      let rect = odiv.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;
      let prect = odiv.parentElement.getBoundingClientRect();
      let pw = prect.width;
      let ph = prect.height;
      if (right < 0 || top < 0) return true;
      if (right > 0 && right - (pw - w) > 0) return true;
      if (top > 0 && top - ph + h > 0) return true;
    }
  },
  computed: {
    ...mapState("features", ["canControlBoard"])
  }
};
</script>

<style lang="scss" scoped>
.live-control {
  position: absolute;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .control-wrap {
    > li {
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
