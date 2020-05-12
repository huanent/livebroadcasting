<template>
  <div class="window" :style="{ top: top + 'px', left: left + 'px' }">
    <header draggable="true" @dragstart="dragstart" @drag="drag" ref="header" @dragend="dragend">
      <span class="timer">定时器</span>
      <div class="close" @click="$emit('close')">+</div>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: ["position"],
  data() {
    return {
      top: 0,
      left: 0,
      topOffset: 0,
      leftOffset: 0
    };
  },
  methods: {
    dragstart(e) {
      e.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = rect.top;
      this.left = rect.left;
      this.topOffset = e.y - rect.top;
      this.leftOffset = e.x - rect.left;
    },
    drag(e) {
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = e.y - this.topOffset;
      this.left = e.x - this.leftOffset;
    },
    dragend(e) {
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = e.y - this.topOffset;
      this.left = e.x - this.leftOffset;
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
