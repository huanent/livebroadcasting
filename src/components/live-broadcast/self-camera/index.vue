<template>
  <div :class="{ 'self-camera-panel': true, hide: !visibility }">
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
      <a @click.stop="onOpenSetting()">
        <icon name="settings" size="16" class="settings-icon"></icon>
      </a>
    </div>
    <div
      v-show="$store.state.features.videoStatus"
      class="local_video"
      ref="video"
    ></div>
    <div v-show="!$store.state.features.videoStatus" class="local_video">
      <icon class="no-video" name="person" color="#34363b" />
    </div>
    <div class="self-camera-footer">
      <div>
        <icon :name="microIcon" color="#0A818C" :size="18" />
        <voice-intensity :intensity="Number(audioLevel)" />
      </div>
    </div>
    <LocalstreamSetting
      :visibility.sync="settingDialogVisible"
      v-if="settingDialogVisible"
    ></LocalstreamSetting>
  </div>
</template>

<script>
import VoiceIntensity from "./voice-intensity";
import { mapState, mapMutations, mapActions } from "vuex";
import { Emitter } from "../../../core/emit";
import { ROLE } from "../../../store/account";
import LocalstreamSetting from "./localstream-setting";
export default {
  name: "SelfCamera",
  data() {
    return {
      visibility: false,
      isServiceReady: false,
      settingDialogVisible: true
    };
  },
  components: {
    VoiceIntensity,
    LocalstreamSetting
  },
  computed: {
    ...mapState("localStream", ["audioLevel", "isInit"]),
    ...mapState("features", ["videoStatus", "audioStatus"]),
    microIcon() {
      return this.audioStatus ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.videoStatus ? "video" : "video-slash";
    }
  },
  watch: {
    isInit(value) {
      if (value && this.$refs.video && this.isServiceReady) {
        this.LOCAL_STREAM_PLAY({ el: this.$refs.video });
        this.visibility = true;
      }
    },
    videoStatus(status) {
      this.switchVideo(status);
    },
    audioStatus(status) {
      this.switchAudio(status);
    }
  },
  mounted() {
    const audioLevelTimer = setInterval(() => {
      this.SET_AUDIOLEVEL();
    }, 200);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(audioLevelTimer);
    });
    Emitter.on("LIVE_READY", () => {
      this.isServiceReady = true;
    });
  },
  methods: {
    ...mapMutations("localStream", [
      "SET_AUDIOLEVEL",
      "LOCAL_STREAM_PLAY",
      "LOCAL_STREAM_STOP_PLAY"
    ]),
    ...mapActions("localStream", ["switchVideo", "switchAudio"]),
    ...mapMutations("features", ["SET_VIDEO_STATUS", "SET_AUDIO_STATUS"]),
    onOpenSetting() {
      this.settingDialogVisible = true;
    },

    onVideoStateChange() {
      this.SET_VIDEO_STATUS(!this.videoStatus);
    },
    onMicroStateChange() {
      this.SET_AUDIO_STATUS(!this.audioStatus);
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  @include themeify {
    background: themed("background_color3");
  }
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
    padding: 15px 10px 6px 10px;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 35%,
      rgba(0, 0, 0, 0) 100%
    );
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

.local_video {
  height: 100%;
  width: 100%;
  background: rgb(52, 54, 58);
}
.no-video {
  width: 100% !important;
  height: 100% !important;
  background-color: #202224;
}
.settings-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
  fill: #979da7 !important;
}
.settings-icon:hover {
  fill: #dcebeb !important;
}
</style>
