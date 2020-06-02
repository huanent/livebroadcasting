<template>
  <div :class="{ 'self-camera-panel': true }" v-show="stream">
    <div class="self-camera-mask">
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
    </div>
    <div v-show="videoStatus" ref="video" class="remote-video-view"></div>
    <div v-show="!videoStatus" class="remote-video-view">
      <icon class="no-video" name="person" color="#34363b" />
    </div>
    <div class="self-camera-footer">
      <div>
        <!-- <icon name="microphone" color="#0A818C" :size="18" />
        <voice-intensity :intensity="0.8" /> -->
      </div>
      <span>
        本人
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { Emitter } from "@/core/emit";
import { liveBroadcastService } from "../../../core/live-broadcast";
import { delay } from "../../../core/utils";
import { ROLE } from "../../../models/role";

export default {
  name: "SelfCameraItem",
  data() {
    return {
      show: false,
      stream: null,
      active: true
    };
  },
  methods: {
    ...mapMutations("features", ["SET_VIDEO_STATUS", "SET_AUDIO_STATUS"]),
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
  },
  async mounted() {
    this.active = true;

    while (this.active) {
      let stream = liveBroadcastService.trtcService.localStream;

      if (this.stream != stream) {
        if (this.stream) this.stream.stop();
        stream.play(this.$refs.video, {
          muted: true
        });

        this.stream = stream;
      }

      await delay(1000);
    }
  },
  beforeDestroy() {
    this.active = false;
  },
  computed: {
    ...mapState("features", ["videoStatus", "audioStatus"]),
    microIcon() {
      return this.audioStatus ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.videoStatus ? "video" : "video-slash";
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  background: #212224;
  position: relative;
  width: auto;
  height: 100%;
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

.remote-video-view {
  height: 100%;
  width: 100%;
  background: rgb(52, 54, 58);
  .no-video {
    width: 100% !important;
    height: 100% !important;
    background-color: #202224;
  }
}
.camera-setting {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
  fill: #979da7 !important;
}
.camera-setting:hover {
  fill: #dcebeb !important;
}
video {
  object-fit: contain !important;
}

/deep/ .el-dialog {
  /* background: #212224;*/
  min-height: 400px;
}
/*/deep/ .el-dialog__title {
            color: white;
          }*/
</style>
