<template>
  <div class="voice-bar">
    <div class="filler" :style="{ width: level * 100 + '%' }"></div>
  </div>
</template>
<script>
export default {
  name: "VoiceBar",
  props: {
    level: Number
  }
};
</script>
<style lang="scss" scoped>
.voice-bar {
  width: 100%;
  height: 2px;
  position: relative;
}
.filler {
  height: 100%;
  position: absolute;
  left: 0;
  background-color: #506efa;
}
</style>
