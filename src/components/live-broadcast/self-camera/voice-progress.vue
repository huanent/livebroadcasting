<template>
  <div class="voice-progress">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="{ active: index <= (percentage / 100) * (list.length - 1) }"
      :style="{
        width: unitWidth + '%',
        height: (index / (list.length - 1)) * 100 + '%',
        'margin-right': gutterWidth + '%'
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "VoiceProgress",
  data() {
    return { list: [] };
  },
  props: {
    percentage: {
      type: Number,
      require: true
    },
    gutterWidth: {
      type: Number,
      default: 1.8
    },
    unitWidth: {
      type: Number,
      default: 1.2
    }
  },
  mounted() {
    let len = 100 / (this.unitWidth + this.gutterWidth);
    this.list = [];
    let list = [];
    for (let i = 0; i < len; i++) {
      list.push(i);
    }
    this.list = list;
  }
};
</script>

<style lang="scss" scoped>
.voice-progress {
  width: 100%;
  display: flex;
  flex-direction: row;
  transform: rotateX(180deg);
}
.voice-progress > div {
  display: inline-block;
  height: 100%;
  flex: 1;
  background-color: #eee;
}
.voice-progress > .active {
  @include themeify {
    background-color: themed("primary");
  }
}
</style>
