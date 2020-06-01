<template>
  <div :class="{ 'self-camera-panel': true }">
    <div class="self-camera-mask" ref="wrapper">
      <div class="self-camera-icons">
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

      <a @click.stop="showSettings = true">
        <icon name="settings" size="16" class="settings-icon"></icon>
      </a>
    </div>
    <div class="local_video" ref="video"></div>
    <div class="self-camera-footer">
      <div>
        <icon :name="microIcon" color="#0A818C" :size="18" />
        <voice-intensity :intensity="Number(audioLevel)" />
      </div>
    </div>
    <LocalstreamSetting
      :visibility.sync="showSettings"
      v-if="showSettings"
    ></LocalstreamSetting>
  </div>
</template>

<script>
import VoiceIntensity from "./voice-intensity";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { Emitter } from "../../../core/emit";
import LocalstreamSetting from "./localstream-setting";
import { ROLE } from "../../../models/role";
import { delay } from "../../../core/utils";
import { liveBroadcastService } from "../../../core/live-broadcast";
export default {
  name: "SelfCamera",
  data() {
    return {
      visibility: false,
      showSettings: true,
      audioLevel: 0,
      active: false,
      stream: null
    };
  },
  components: {
    VoiceIntensity,
    LocalstreamSetting
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher", "teacherStreamId"]),
    ...mapState("workplace", ["token", "teachId"]),
    ...mapState("features", ["videoStatus", "audioStatus"]),
    ...mapState("account", ["userInfo"]),
    microIcon() {
      return this.audioStatus ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.videoStatus ? "video" : "video-slash";
    }
  },
  async mounted() {
    this.active = true;
    this.setStream();
    this.setAudioLevel();
  },
  beforeDestroy() {
    this.active = false;
  },
  methods: {
    ...mapMutations("features", ["SET_VIDEO_STATUS", "SET_AUDIO_STATUS"]),
    async setStream() {
      while (this.active) {
        let stream = this.isTeacher
          ? liveBroadcastService.trtcService.localStream
          : liveBroadcastService.trtcService.getRemoteStream(
              this.teacherStreamId
            );

        if (!stream) {
          if (this.stream) this.stream.stop();
          this.stream = null;
        }

        if (stream != this.stream) {
          if (!this.isTeacher) {
            liveBroadcastService.trtcService.subscribe(stream, true, true);
          }

          stream.play(this.$refs.video, { muted: this.isTeacher });
          this.stream = stream;
        }

        await delay(1000);
      }
    },
    async setAudioLevel() {
      while (this.active) {
        if (this.stream) {
          this.$nextTick(() => (this.audioLevel = this.stream.getAudioLevel()));
        }
        await delay(100);
      }
    },
    audioChanged() {
      if (!this.stream) return;
      this.audioStatus ? this.stream.muteAudio() : this.stream.unmuteAudio();
      this.SET_AUDIO_STATUS(!this.audioStatus);
    },
    videoChanged() {
      if (!this.stream) return;
      this.videoStatus ? this.stream.muteVideo() : this.stream.unmuteVideo();
      this.SET_VIDEO_STATUS(!this.videoStatus);
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  @include themeify {
    background: themed("background_color2");
  }
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

    @include themeify {
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.5) 35%,
        rgba(0, 0, 0, 0) 100%
      );
    }

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
  position: relative;
  height: 100%;
  width: 100%;
  video {
    object-fit: fill;
    height: 100%;
    width: 100%;
  }
}
.no-video {
  width: 100% !important;
  height: 100% !important;
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

.select-header {
  text-align: center;
  z-index: 100;
  @include themeify {
    background: themed("background_color2");
    color: themed("font_color1");
  }
  padding: 0 0.5rem;
  cursor: pointer;
  span {
    padding-right: 0.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.02rem;
  }
}
</style>
