<template>
  <div class="self-camera-panel">
    <div class="self-camera-mask">
      <icon name="microphone" color="#737882" :size="24" />
      <icon name="video" color="#737882" :size="24" />
    </div>
    <div id="local_video" style="height: 100%;width: 100%"></div>
    <div class="self-camera-footer"></div>
  </div>
</template>

<script>
export default {
  name: "SelfCamera"
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  background: #212224;
  margin: 10px 10px 5px;
  position: relative;
  .self-camera-mask {
    position: absolute;
    opacity: 0;
    transition: all 0.1s;
    z-index: 9;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .self-camera-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 32px;
    line-height: 24px;
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.45);
  }
  &:hover {
    .self-camera-mask {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.5);
      border: 2px solid #0a818c;
      text-align: center;
    }
  }
}
</style>
