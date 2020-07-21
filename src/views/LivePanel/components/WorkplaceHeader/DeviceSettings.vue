<template>
  <CustomDialog
    :title="$t('title.setting')"
    :secondary-title="'Personal Settings'"
    :visible="visibility"
    :append-to-body="true"
    @close="close"
    @closed="closed"
    @open="open"
    :on-confirm="save"
    :on-cancel="close"
    :footer-visibity="true"
  >
    <div class="dialog-item">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8" :md="14">
          <div class="select-item">
            <div class="dialog-title">{{ $t("setting.camera") }}</div>
            <el-select
              v-if="access.video"
              style="width:100%"
              :value="camera && camera.label"
              @change="cameraChanged"
              :placeholder="$t('setting.chooseCamera')"
            >
              <el-option
                v-for="item in cameras"
                :key="item.deviceId"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-alert
              v-if="access.video === undefined"
              title="获取摄像头异常"
              type="error"
              description="可能浏览器未授权、设备被占用或者设备故障"
              show-icon
              :closable="false"
            >
            </el-alert>
          </div>
          <div class="select-item">
            <div class="dialog-title">{{ $t("setting.micro") }}</div>
            <el-select
              v-if="access.audio"
              style="width:100%"
              :value="microphone && microphone.label"
              @change="microphoneChanged"
              :placeholder="$t('setting.chooseMicro')"
            >
              <el-option
                v-for="item in microphones"
                :key="item.deviceId"
                value-key="deviceId"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-alert
              v-if="access.audio === undefined"
              title="获取麦克风异常"
              type="error"
              description="可能浏览器未授权、设备被占用或者设备故障"
              show-icon
              :closable="false"
            >
            </el-alert>
          </div>
        </el-col>
        <el-col :xs="24" :sm="16" :md="10">
          <div class="media-container">
            <video
              ref="video"
              autoplay="autoplay"
              muted="true"
              :src-object.prop="videoStream"
            ></video>
          </div>
        </el-col>
      </el-row>

      <div class="dialog-item">
        <div class="wave-container">
          <audio-wave :stream="audioStream" v-if="visibility" />
        </div>
      </div>
    </div>
  </CustomDialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";
import { requestDeviceAccess } from "@/core/utils";
import { releaseStream } from "@/core/utils";
import AudioWave from "@c/Camera/AudioWave";
import CustomDialog from "@/components/custom-dialog";
export default {
  name: "LocalstreamSetting",
  data() {
    return {
      microphones: [],
      cameras: [],
      access: {
        video: null,
        audio: null
      },
      audioStream: null,
      videoStream: null
    };
  },
  props: {
    visibility: {
      type: Boolean
    }
  },
  components: {
    AudioWave,
    CustomDialog
  },
  async mounted() {
    this.access = await requestDeviceAccess();
    this.open();
  },
  computed: {
    ...mapState("device", ["isMobile"]),
    ...mapState("features", ["videoStatus", "audioStatus"]),
    ...mapState("workplace", ["selectedCamera", "selectedMicrophone"]),
    microphone() {
      return this.microphones.find(f => f.label == this.selectedMicrophone);
    },
    camera() {
      return this.cameras.find(f => f.label == this.selectedCamera);
    }
  },
  methods: {
    ...mapMutations("workplace", ["SELECT_DEVICES"]),
    async cameraChanged(e) {
      this.SELECT_DEVICES({
        camera: e.label,
        microphone: this.selectedMicrophone
      });
    },
    async microphoneChanged(e) {
      this.SELECT_DEVICES({ camera: this.selectedCamera, microphone: e.label });
    },
    async save() {
      if (this.camera) {
        await liveBroadcastService.trtcService.setCamera(
          this.camera.deviceId,
          this.videoStatus
        );
      }

      if (this.microphone) {
        await liveBroadcastService.trtcService.setMicrophone(
          this.microphone.deviceId,
          this.audioStatus
        );
      }

      this.close();
    },
    close() {
      this.$emit("update:visibility", false);
    },
    closed() {
      if (this.audioStream) releaseStream(this.audioStream);
      if (this.videoStream) releaseStream(this.videoStream);
    },
    async open() {
      this.cameras = await liveBroadcastService.trtcService.getCameras();
      this.microphones = await liveBroadcastService.trtcService.getMicrophones();
      console.log(this.cameras);
      this.setAudio();
      this.setVideo();
    },
    async setAudio() {
      if (this.audioStream) releaseStream(this.audioStream);
      if (!this.microphone) return;
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: this.microphone.deviceId
        },
        video: false
      });
    },
    async setVideo() {
      if (this.videoStream) releaseStream(this.videoStream);
      if (!this.camera) return;

      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: this.camera.deviceId
        },
        audio: false
      });
    }
  },
  watch: {
    microphone(value) {
      this.setAudio();
    },
    camera(value) {
      this.setVideo();
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  /* background: #212224;*/
  min-height: 400px;
}

.dialog-item {
  video {
    transform: rotateY(180deg);
  }
  margin-bottom: 15px;
  .select-item {
    margin-bottom: 1.4rem;
    @media screen and (max-width: 1440px) {
      margin-bottom: 0.5rem;
    }
  }
  &.loudspeaker {
    width: 25%;
    border: 1px solid #ccc;
    border-radius: 7px;
    padding: 5px;
    > span {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .dialog-title {
    margin-bottom: 5px;
  }
  .el-progress {
    /deep/.el-progress__text {
      font-size: 10px !important;
    }
  }
}
.btn-list {
  margin-top: 18px;
  text-align: center;
  > button {
    margin-right: 25px;
  }
}
.media-container {
  width: 100%;
  height: auto;
  margin: 0 auto;
  margin-top: 20px;

  overflow: hidden;
  video {
    width: 100%;
    height: 100%;
    border-radius: 0.2rem;
  }
}
.wave-container {
  width: 100%;
  height: 7rem;
}
</style>
