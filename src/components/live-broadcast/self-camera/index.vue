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
    <div id="local_video" ref="video"></div>
    <div class="self-camera-footer">
      <div>
        <icon name="microphone" color="#0A818C" :size="18" />
        <voice-intensity :intensity="0.8" />
      </div>
      <!--      <span>
        username
      </span>-->
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

export default {
  name: "SelfCamera",
  data() {
    return {
      isMicroOpen: true,
      isVideoOpen: true,
      visibility: false,
      dialogVisible: false,
      activeCameraDevice: {},
      activeMicrophonesDevice: {}
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
    },
    cameraDeviceList() {
      return this.$store.state.workplace.cameraDeviceList;
    },
    microphonesDeviceList() {
      return this.$store.state.workplace.microphonesDeviceList;
    },
    activeCamera() {
      this.activeCameraDevice = this.$store.state.workplace.activeCamera;
      return this.$store.state.workplace.activeCamera;
    },
    activeMicrophones() {
      this.activeMicrophonesDevice = this.$store.state.workplace.activeMicrophones;
      return this.activeMicrophonesDevice;
    }
  },
  mounted() {
    this.observerVideoInit();
  },
  methods: {
    observerVideoInit() {
      if (!this.$refs.video) return;
      let targetNode = this.$refs.video;
      let config = {
        childList: true,
        subtree: true
      };
      let observer;
      const mutationCallback = mutationsList => {
        for (let mutation of mutationsList) {
          let type = mutation.type;
          if (type === "childList") {
            this.visibility = true;
            if (observer) {
              observer.disconnect();
            }
          }
        }
      };
      observer = new MutationObserver(mutationCallback);
      observer.observe(targetNode, config);
    },
    onMicroStateChange() {
      // state must stored in vuex
      this.isMicroOpen = !this.isMicroOpen;
    },
    onVideoStateChange() {
      this.isVideoOpen = !this.isVideoOpen;
    },
    onOpenSetting() {
      this.dialogVisible = true;
    },
    onDialogClose() {
      this.dialogVisible = false;
    },
    onDialogSave() {
      if (this.activeCameraDevice) {
        this.$store.commit("workplace/ACTIVE_CAMERA", this.activeCameraDevice);
      }
      if (this.activeMicrophonesDevice) {
        this.$store.commit(
          "workplace/ACTIVE_MICROPHONES",
          this.activeMicrophonesDevice
        );
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
#local_video {
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
