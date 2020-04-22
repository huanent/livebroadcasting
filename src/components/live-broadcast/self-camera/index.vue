<template>
  <div class="self-camera-panel">
    <div class="self-camera-mask">
      <div class="self-camera-icons">
        <icon
          @click.native.stop="onMicroStateChange"
          :name="microIcon"
          color="#737882"
          :size="20"
        />
        <icon
          @click.native.stop="onVideoStateChange"
          :name="videoIcon"
          color="#737882"
          :size="20"
        />
      </div>
    </div>
    <div id="local_video" style="height: 100%;width: 100%"></div>
    <div class="self-camera-footer">
      <div>
        <icon name="microphone" color="#0A818C" :size="18" />
        <voice-intensity :intensity="0.6" />
      </div>
      <span>123</span>
    </div>
  </div>
</template>

<script>
import VoiceIntensity from "./voice-intensity";

export default {
  name: "SelfCamera",
  data() {
    return {
      isMicroOpen: true,
      isVideoOpen: true
    };
  },
  components: {
    VoiceIntensity
  },
  computed: {
    microIcon() {
      return this.isMicroOpen ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.isVideoOpen ? "video" : "video-slash";
    }
  },
  methods: {
    onMicroStateChange() {
      // state must stored in vuex
      this.isMicroOpen = !this.isMicroOpen;
    },
    onVideoStateChange() {
      this.isVideoOpen = !this.isVideoOpen;
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  background: #212224;
  margin: 10px 10px 5px;
  position: relative;
  .self-camera-mask {
    position: absolute;
    visibility: hidden;
    transition: all 0.1s;
    z-index: 9;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #0a818c;
    text-align: center;
    .self-camera-icons {
      position: relative;
      top: 50%;
      margin-top: -12px;
      svg {
        background-color: #34363b;
        border-radius: 50%;
        padding: 8px;
        &:hover {
          fill: #dcebeb !important;
        }
        &:last-child {
          margin-left: 30px;
        }
      }
    }
  }
  .self-camera-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.45);
    > div {
      display: flex;
      align-items: center;
    }
    > span {
      color: #ccc;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
    }
  }
  &:hover {
    .self-camera-mask {
      visibility: visible;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
