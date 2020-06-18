<template>
  <div class="window" :style="{ top: top + '%', left: left + '%' }">
    <header
      :draggable="isTeacher && !notdrag"
      @dragstart="dragstart"
      @drag="drag"
      ref="header"
      @dragend="dragend"
    >
      <span class="timer">{{ nameWidget }}</span>
      <div class="close" @click="$emit('close')" v-if="isTeacher">
        +
      </div>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "WidgetWindow",
  props: ["position", "nameWidget", "notdrag"],
  data() {
    return {
      top: 0,
      left: 0,
      topOffset: 0,
      leftOffset: 0
    };
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher"])
  },
  methods: {
    dragstart(e) {
      e.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = this.getPercentage(rect.top);
      this.left = this.getPercentage(rect.left, "width");
      this.topOffset = e.y - rect.top;
      this.leftOffset = e.x - rect.left;
    },
    drag(e) {
      if (e.y == 0 && e.x == 0) return;
      this.top = this.getPercentage(e.y - this.topOffset);
      this.left = this.getPercentage(e.x - this.leftOffset, "width");
    },
    dragend(e) {
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = this.getPercentage(e.y - this.topOffset);
      this.left = this.getPercentage(e.x - this.leftOffset, "width");
      this.$emit("moved", { x: this.left, y: this.top });
    },
    getPercentage(num, type) {
      if (type == "width") return (num / document.body.clientWidth) * 100;
      else return (num / document.body.clientHeight) * 100;
    }
  },
  watch: {
    position: {
      handler(value) {
        if (!value) return;
        this.top = value.y;
        this.left = value.x;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.window {
  //  transition: left 1s linear 2s;
  //  transition: top 1s linear 2s;
  header {
    text-align: center;
    color: #fff;
    height: 26px;
    line-height: 26px;
    background-color: #484950;
    width: 100%;
    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0px;
      font-size: 20px;
      color: #98989c;
      transform: rotate(45deg);
      cursor: pointer;
    }
  }
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0px 0px 5px #888888;
  background-color: #fff;
  z-index: 100000;
}
</style>
