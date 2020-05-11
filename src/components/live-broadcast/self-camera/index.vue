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
        <icon name="settings" size="16" class="camera-setting"></icon>
      </a>
    </div>
    <div class="local_video" ref="video"></div>
    <div class="self-camera-footer">
      <div>
        <icon :name="microIcon" color="#0A818C" :size="18" />
        <voice-intensity :intensity="Number(audioLevel)" />
      </div>
    </div>
    <el-dialog
      title="设置"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="onDialogClose"
      :append-to-body="true"
    >
      <div>
        <div>
          <el-select
            v-model="activeCameraDevice"
            placeholder="请选择视频输入设备"
          >
            <el-option
              v-for="item in cameraDeviceList"
              :key="item.deviceId"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select
            v-model="activeMicrophonesDevice"
            placeholder="请选择音频输入设备"
          >
            <el-option
              v-for="item in microphonesDeviceList"
              :key="item.deviceId"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>

        <div>
          <el-button @click="onDialogClose()">取 消</el-button>
          <el-button type="primary" @click="onDialogSave()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VoiceIntensity from "./voice-intensity";
import { mapGetters, mapMutations } from "vuex";
import { Emitter } from "../../../core/emit";

export default {
  name: "SelfCamera",
  data() {
    return {
      visibility: false,
      isServiceReady: false,
      dialogVisible: false,
      activeCameraDevice: {},
      activeMicrophonesDevice: {}
    };
  },
  components: {
    VoiceIntensity
  },
  created() {
    this.activeMicrophonesDevice = this.$store.state.workplace.activeMicrophones;
    this.activeCameraDevice = this.$store.state.workplace.activeCamera;
  },
  computed: {
    ...mapGetters("localStream", [
      "localAudioStatus",
      "localVideoStatus",
      "audioLevel",
      "isInit"
    ]),
    ...mapGetters("workplace", [
      "microphonesDeviceList",
      "cameraDeviceList",
      "panelType"
    ]),
    microIcon() {
      return this.localAudioStatus ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.localVideoStatus ? "video" : "video-slash";
    }
  },
  watch: {
    isInit(value) {
      if (value && this.$refs.video && this.isServiceReady) {
        console.log("2", this.$refs.video);
        console.log(this.isServiceReady);
        this.LOCAL_STREAM_PLAY(this.$refs.video);
        this.visibility = true;
      }
    },
    panelType(value) {
      if (value !== "camera" && this.isServiceReady) {
        if (this.role !== "ROLE_STUDENT") {
          this.LOCAL_STREAM_STOP_PLAY();
        }
        setTimeout(() => {
          this.LOCAL_STREAM_PLAY(this.$refs.video);
        }, 300);
      }
    }
  },
  mounted() {
    const audioLevelTimer = setInterval(() => {
      this.SET_AUDIOLEVEL();
    }, 200);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(audioLevelTimer);
    });
    Emitter.on("SYS_SET_REMOTE_AUDIO", data => {
      this.SET_LOCALSTREAM_AUDIO(data.data);
    });
    Emitter.on("SYS_SET_REMOTE_VIDEO", data => {
      this.SET_LOCALSTREAM_VIDEO(data.data);
    });
    Emitter.on("LIVE_READY", () => {
      this.isServiceReady = true;
    });
  },
  methods: {
    ...mapMutations("account", ["role"]),
    ...mapMutations("workplace", ["ACTIVE_CAMERA", "ACTIVE_MICROPHONES"]),
    ...mapMutations("localStream", [
      "SET_LOCALSTREAM_AUDIO",
      "SET_LOCALSTREAM_VIDEO",
      "SET_AUDIOLEVEL",
      "LOCAL_STREAM_PLAY",
      "LOCAL_STREAM_STOP_PLAY"
    ]),
    onMicroStateChange() {
      this.SET_LOCALSTREAM_AUDIO(!this.localAudioStatus);
    },
    onVideoStateChange() {
      this.SET_LOCALSTREAM_VIDEO(!this.localVideoStatus);
    },
    onOpenSetting() {
      this.dialogVisible = true;
    },
    onDialogClose() {
      this.dialogVisible = false;
    },
    onDialogSave() {
      if (this.activeCameraDevice) {
        this.ACTIVE_CAMERA(this.activeCameraDevice);
      }
      if (this.activeMicrophonesDevice) {
        this.ACTIVE_MICROPHONES(this.activeMicrophonesDevice);
      }
      this.dialogVisible = false;
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
.hide {
  visibility: hidden;
}
.local_video {
  height: 100%;
  width: 100%;
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

/deep/ .el-dialog {
  /* background: #212224;*/
  min-height: 400px;
}
/*/deep/ .el-dialog__title {
  color: white;
}*/
</style>
