<template>
  <div
    :class="{ 'self-camera-panel': true, hide: !visibility }"
    :style="{
      width: width + '%'
    }"
  >
    <div class="self-camera-mask" ref="wrapper">
      <div class="self-camera-icons" v-show="selected.type === 'local'">
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
      <div class="self-camera-icons" v-show="selected.type === 'teacher'">
        <icon
          @click.native.stop="onMutedChange"
          :name="!teacherAudioMuted ? 'microphone' : 'microphone-slash'"
          color="#737882"
          :size="20"
        />
      </div>
      <a @click.stop="onOpenSetting()">
        <icon name="settings" size="16" class="settings-icon"></icon>
      </a>
    </div>
    <div class="local_video">
      <video
        ref="videoLocal"
        style="object-fit: contain"
        :muted="true"
        v-show="selected.type === 'local' && $store.state.features.videoStatus"
        autoplay
      ></video>
      <video
        ref="videoTeacher"
        v-show="selected.type === 'teacher'"
        style="object-fit: contain"
        autoplay
        :muted="teacherAudioMuted"
      ></video>
      <icon
        v-show="!$store.state.features.videoStatus"
        class="no-video"
        name="person"
        color="#34363b"
      />
    </div>
    <div
      class="self-camera-footer"
      v-show="$store.state.features.videoStatus && selected.type === 'local'"
    >
      <div>
        <icon :name="microIcon" color="#0A818C" :size="18" />
        <voice-intensity :intensity="Number(audioLevel)" />
      </div>
    </div>
    <LocalstreamSetting
      :visibility.sync="settingDialogVisible"
      v-if="settingDialogVisible"
      @onsave="onsave"
    ></LocalstreamSetting>
    <div
      style="position: absolute;right: 0;top:0.5rem;z-index: 999;cursor: pointer;min-width: 4rem"
    >
      <TypeSelect
        v-show="role !== ROLE.TEACHER"
        :selected.sync="selected"
      ></TypeSelect>
    </div>
  </div>
</template>

<script>
import VoiceIntensity from "./voice-intensity";
import { mapState, mapMutations, mapActions } from "vuex";
import { Emitter } from "../../../core/emit";
import TypeSelect from "./type-select";
import LocalstreamSetting from "./localstream-setting";
import { ROLE } from "../../../models/role";
export default {
  name: "SelfCamera",
  data() {
    return {
      visibility: false,
      settingDialogVisible: true,
      videoLocalWidth: 0,
      videoTeacherWidth: 0,
      teacherAudioMuted: false,
      selected: {
        title: "本地",
        type: "local"
      }
    };
  },
  components: {
    VoiceIntensity,
    LocalstreamSetting,
    TypeSelect
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("localStream", ["audioLevel", "localStreamReady"]),
    ...mapState("features", ["videoStatus", "audioStatus"]),
    ...mapState("remoteStream", ["teacherStreamReady"]),
    microIcon() {
      return this.audioStatus ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.videoStatus ? "video" : "video-slash";
    },
    width() {
      if (this.selected.type === "local" && this.videoLocalWidth > 0)
        return this.videoLocalWidth;
      if (this.selected.type === "teacher" && this.videoLocalWidth > 0)
        return this.videoTeacherWidth;
      return 100;
    }
  },
  watch: {
    localStreamReady(value) {
      this.LOCAL_STREAM_PLAY({ el: this.$refs.videoLocal });
      this.visibility = true;
    },

    teacherStreamReady(value) {
      if (this.role === ROLE.TEACHER) return;
      this.TEACHER_REMOTE_STREAM_PLAY(this.$refs.videoTeacher);
      this.visibility = true;
    },
    videoStatus(status) {
      this.switchVideo(status);
    },
    audioStatus(status) {
      this.switchAudio(status);
    }
  },
  mounted() {
    if (this.role === ROLE.STUDENT) {
      this.selected = {
        title: "老师",
        type: "teacher"
      };
    }
    const audioLevelTimer = setInterval(() => {
      this.SET_AUDIOLEVEL();
    }, 200);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(audioLevelTimer);
    });
    let videoLocal = this.$refs.videoLocal;
    let vm = this;
    videoLocal.addEventListener("canplay", ({ target }) => {
      let w = target.videoWidth;
      let h = target.videoHeight;
      vm.videoLocalWidth = (h * 100) / w;
    });
    let videoTeacher = this.$refs.videoLocal;
    videoTeacher.addEventListener("canplay", ({ target }) => {
      let w = target.videoWidth;
      let h = target.videoHeight;
      vm.videoTeacherWidth = (h * 100) / w;
    });
  },
  methods: {
    ...mapMutations("localStream", [
      "SET_AUDIOLEVEL",
      "LOCAL_STREAM_PLAY",
      "LOCAL_STREAM_STOP_PLAY"
    ]),
    ...mapActions("localStream", ["switchVideo", "switchAudio"]),
    ...mapMutations("localStream", ["TEACHER_REMOTE_STREAM_PLAY"]),
    ...mapMutations("features", ["SET_VIDEO_STATUS", "SET_AUDIO_STATUS"]),
    onOpenSetting() {
      this.settingDialogVisible = true;
    },

    onVideoStateChange() {
      this.SET_VIDEO_STATUS(!this.videoStatus);
    },
    onMicroStateChange() {
      this.SET_AUDIO_STATUS(!this.audioStatus);
    },
    onMutedChange() {
      this.teacherAudioMuted = !this.teacherAudioMuted;
    },
    onchange(selected) {
      this.selected = selected;
    },
    onsave() {
      this.LOCAL_STREAM_PLAY({ el: this.$refs.videoLocal });
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  @include themeify {
    background: themed("background_color2");
  }
  margin: 0 auto;
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
