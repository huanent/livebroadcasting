<template>
  <div class="camera">
    <video-player
      :muted="isLocal"
      :mirror="mirror"
      :stream-id="streamId"
      ref="videoPlayer"
      fit="cover"
    />
    <div class="mask-layer" v-if="controllable">
      <icon
        @click.native.stop="audioChanged"
        :name="microIcon"
        color="#737882"
        :size="20"
      />
      <icon
        @click.native.stop="videoChanged"
        :name="videoIcon"
        color="#737882"
        :size="20"
      />
    </div>
    <div class="audio-level">
      <icon :name="microIcon" color="#0A818C" :size="18" />
      <voice-intensity :intensity="intensity" />
    </div>
  </div>
</template>
<script>
import VideoPlayer from "./video-player";
import voiceIntensity from "./voice-intensity";
import { mapState, mapMutations, mapActions } from "vuex";
import { delay } from "../../../core/utils";
export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    streamId: String,
    mirror: Boolean,
    subscribeAudio: Boolean,
    subscribeVideo: Boolean,
    controllable: Boolean
  },
  data() {
    return {
      active: true,
      intensity: 0
    };
  },
  mounted() {
    this.getAudioLevel();
  },
  beforeDestroy() {
    this.active = false;
  },
  computed: {
    ...mapState("features", ["videoStatus", "audioStatus"]),
    isLocal() {
      return this.streamId == "__local";
    },
    stream() {
      return this.$refs.videoPlayer.stream;
    },
    microIcon() {
      let status = this.isLocal ? this.audioStatus : this.subscribeAudio;
      return status ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      let status = this.isLocal ? this.videoStatus : this.subscribeVideo;
      return status ? "video" : "video-slash";
    }
  },
  methods: {
    ...mapMutations("features", ["SET_VIDEO_STATUS", "SET_AUDIO_STATUS"]),
    ...mapActions("features", ["manualControlFeatures"]),
    audioChanged() {
      if (!this.stream) return;

      if (this.isLocal) {
        this.audioStatus ? this.stream.muteAudio() : this.stream.unmuteAudio();
        this.SET_AUDIO_STATUS(!this.audioStatus);
      } else {
        this.manualControlFeatures({
          id: this.streamId,
          propName: "subscribeAudio",
          value: !this.subscribeAudio
        });
      }
    },
    videoChanged() {
      if (!this.stream) return;

      if (this.isLocal) {
        this.videoStatus ? this.stream.muteVideo() : this.stream.unmuteVideo();
        this.SET_VIDEO_STATUS(!this.videoStatus);
      } else {
        this.manualControlFeatures({
          id: this.streamId,
          propName: "subscribeVideo",
          value: !this.subscribeVideo
        });
      }
    },
    async getAudioLevel() {
      while (this.active) {
        if (this.stream) {
          this.$nextTick(() => {
            this.intensity = this.stream.getAudioLevel();
            console.log(this.intensity);
          });
        }
        await delay(100);
      }
    }
  },
  components: {
    VideoPlayer,
    voiceIntensity
  }
};
</script>
<style lang="scss" scoped>
.camera {
  height: 100%;
  width: 100%;
  position: relative;
  .mask-layer {
    position: absolute;
    visibility: hidden;
    border: 2px solid #0a818c;
    transition: all 0.1s;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .audio-level {
    position: absolute;
    bottom: 3px;
    left: 3px;
  }
  &:hover {
    .mask-layer {
      visibility: visible;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
