<template>
  <div class="camera-voice-intensity">
    <icon :name="microIcon" class="micro" color="#0A818C" :size="18" />
    <span
      v-for="(item, index) in lines"
      :key="index"
      :class="['camera-voice__line', { active: activeIndex >= index + 1 }]"
    ></span>
  </div>
</template>

<script>
const INTENSITY__LINES = 6;

export default {
  name: "VoiceIntensity",
  data() {
    return {
      lines: INTENSITY__LINES
    };
  },
  props: {
    intensity: {
      type: Number,
      default: 0
    },
    status: Boolean
  },
  computed: {
    activeIndex() {
      return this.intensity * INTENSITY__LINES;
    },
    microIcon() {
      return this.status ? "microphone" : "microphone-slash";
    }
  }
};
</script>

<style lang="scss" scoped>
.camera-voice-intensity {
  transition: all 0.02s ease;
  color: #0a818c;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin-left: 5px;
  padding-top: 2px;
  padding-left: 20px;
  font-size: 0;
  .camera-voice__line {
    display: inline-block;
    width: 2px;
    height: 100%;
    margin-right: 3px;
    background-color: #4b505a;
    text-shadow: 0 0 black;
    &:first-child {
      height: 0px;
    }
    &:nth-child(2) {
      height: 6px;
    }
    &:nth-child(3) {
      height: 8px;
    }
    &:nth-child(4) {
      height: 10px;
    }
    &:nth-child(5) {
      height: 12px;
    }
    &:nth-child(6) {
      height: 14px;
    }
  }
  .active {
    background-color: #737882;
  }
  .micro {
    position: absolute;
    left: 0;
  }
}
</style>
