<template>
  <div class="content" :style="{ top: top + 'px', left: left + 'px' }">
    <div
      class="contain"
      :draggable="true"
      @dragstart="dragstart"
      @drag="drag"
      ref="header"
      @dragend="dragend"
    ></div>
  </div>
</template>
<script>
export default {
  name: "App",
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
      //   this.$emit("moved", { x: this.left, y: this.top });
    }
  },
  watch: {
    "names.sa"(newName, oldName) {
      console.log("obj.sa changed");
    }
  }
};
</script>
<style  scoped>
.content {
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
}
.contain {
  width: 200px;
  height: 200px;
  background: #eee;
  border-radius: 50%;
}
</style>
