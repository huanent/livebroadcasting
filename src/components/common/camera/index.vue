<template>
  <div class="camera">
    <video-player
      :muted="isLocal"
      :mirror="mirror"
      :stream-id="streamId"
      ref="videoPlayer"
      fit="cover"
      @stream-changed="stream = $event"
    />
    <div v-show="showNoVideo" class="no-video">
      <icon name="person" color="#34363b" />
    </div>
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
    <div class="footer">
      <icon
        :name="microIcon"
        color="#0A818C"
        :size="18"
        v-if="!hiddenVoiceIntensity"
      />
      <voice-intensity
        :intensity="Number(intensity)"
        v-if="!hiddenVoiceIntensity"
      />
      <p>{{ name }}</p>
    </div>
  </div>
</template>
<script>
import VideoPlayer from "./video-player";
import voiceIntensity from "./voice-intensity";
import { mapState, mapMutations, mapActions } from "vuex";
import { delay } from "../../../core/utils";
import { liveBroadcastService } from "../../../core/live-broadcast";
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
    controllable: Boolean,
    hiddenVoiceIntensity: Boolean,
    alwaysLocalMuted: Boolean
  },
  data() {
    return {
      active: true,
      intensity: 0,
      stream: null,
      audioMuted: !this.subscribeAudio,
      videoMuted: !this.subscribeVideo
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
    microIcon() {
      let status = this.isLocal
        ? this.audioStatus
        : this.alwaysLocalMuted
        ? !this.audioMuted
        : this.subscribeAudio;

      return status ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      let status = this.isLocal
        ? this.videoStatus
        : this.alwaysLocalMuted
        ? !this.videoMuted
        : this.subscribeVideo;

      return status ? "video" : "video-slash";
    },
    showNoVideo() {
      if (this.isLocal) {
        return !this.videoStatus;
      } else {
        return !this.subscribeVideo || !this.stream;
      }
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
      } else if (this.alwaysLocalMuted) {
        this.audioMuted = !this.audioMuted;
        this.audioMuted ? this.stream.muteAudio() : this.stream.unmuteAudio();
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
      } else if (this.alwaysLocalMuted) {
        this.videoMuted = !this.videoMuted;
        this.videoMuted ? this.stream.muteVideo() : this.stream.unmuteVideo();
      } else {
        this.manualControlFeatures({
          id: this.streamId,
          propName: "subscribeVideo",
          value: !this.subscribeVideo
        });
      }
    },
    async getAudioLevel() {
      while (this.active && !this.hiddenVoiceIntensity) {
        if (this.stream) {
          this.$nextTick(() => (this.intensity = this.stream.getAudioLevel()));
        }
        await delay(300);
      }
    },
    async changeVideo() {
      if (!this.stream || this.isLocal) return;
      await liveBroadcastService.trtcService.subscribe(
        this.stream,
        true,
        this.subscribeVideo
      );
    },
    async changeAudio() {
      if (!this.stream || this.isLocal) return;
      this.subscribeAudio ? this.stream.unmuteAudio() : this.stream.muteAudio();
    }
  },
  components: {
    VideoPlayer,
    voiceIntensity
  },
  watch: {
    subscribeAudio(value) {
      this.changeAudio();
    },
    subscribeVideo() {
      this.changeVideo();
    },
    async stream() {
      await this.changeVideo();
      this.changeAudio();
    }
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
  &:hover {
    .mask-layer {
      visibility: visible;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 3px;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 35%,
      rgba(0, 0, 0, 0) 100%
    );
    p {
      flex-grow: 1;
      text-align: right;
    }
  }
  .no-video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(52, 54, 58);
    .svg-icon {
      width: 100% !important;
      height: 100% !important;
      background-color: #202224;
    }
  }
}
</style>
