<template>
  <el-dialog
    :title="$t('setting')"
    :visible.sync="visibility"
    :width="dialogWidth"
    :before-close="onDialogClose"
    :append-to-body="true"
  >
    <div class="dialog-item">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <div class="select-item">
            <div class="dialog-title">{{ $t("setting.micro") }}</div>
            <el-select
              style="width:100%"
              :value="activeMicrophones"
              value-key="label"
              @change="onactiveMicrophonesChange"
              :placeholder="$t('setting.chooseMicro')"
            >
              <el-option
                v-for="item in microphonesDeviceList"
                :key="item.deviceId"
                value-key="deviceId"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="select-item">
            <div class="dialog-title">{{ $t("setting.camera") }}</div>
            <el-select
              style="width:100%"
              :value="activeCamera"
              value-key="deviceId"
              @change="onActiveCameraChange"
              :placeholder="$t('setting.chooseCamera')"
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
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="media-container">
            <video ref="video" autoplay="autoplay"></video>
          </div>
        </el-col>
      </el-row>

      <div class="dialog-item">
        <div class="wave-container">
          <canvas id="oscilloscope"></canvas>
        </div>
      </div>

      <span slot="footer" class="clearfix">
        <div class="right">
          <el-button @click="onDialogClose()">{{
            $t("button.close")
          }}</el-button>
          <el-button type="primary" @click="onDialogSave()">{{
            $t("button.yes")
          }}</el-button>
        </div>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";

export default {
  name: "LocalstreamSetting",
  data() {
    return {
      activeLoudspeakersDevice: {},
      microphonesDeviceList: [],
      cameraDeviceList: [],
      speakerDeviceList: [],
      activeSpeaker: undefined,
      percentage: 0,
      testStream: undefined,
      mediaDevices: undefined,
      audioLevelTimer: undefined
    };
  },
  props: {
    visibility: {
      type: Boolean
    }
  },
  mounted() {
    this.$once("hook:beforeDestroy", () => {
      if (this.audioLevelTimer) {
        clearInterval(this.audioLevelTimer);
      }
    });
    this.getDevice();
    this.play();
  },

  computed: {
    ...mapState("workplace", ["activeCamera", "activeMicrophones"]),
    ...mapState("device", ["isMobile"]),
    dialogWidth() {
      return this.isMobile ? "80%" : "40%";
    }
  },
  watch: {
    activeCamera() {
      this.play();
    },
    activeMicrophones() {
      this.play();
    }
  },
  methods: {
    ...mapMutations("workplace", ["ACTIVE_CAMERA", "ACTIVE_MICROPHONES"]),
    ...mapActions("workplace", ["switchCamera", "switchMicrophones"]),
    onDialogClose() {
      clearInterval(this.audioLevelTimer);
      this.$emit("update:visibility", false);
    },
    getDevice() {
      this.cameraDeviceList = [];
      this.microphonesDeviceList = [];
      this.speakerDeviceList = [];
      navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
        mediaDevices.forEach(item => {
          let devices = {
            kind: item.kind,
            deviceId: item.deviceId,
            label: item.label
          };
          if (devices.kind === "videoinput") {
            this.cameraDeviceList.push(devices);
          }
          if (devices.kind === "audioinput") {
            this.microphonesDeviceList.push(devices);
          }
          if (devices.kind === "audiooutput") {
            this.speakerDeviceList.push(devices);
          }
        });
      });
    },
    initWave() {
      let audioContext = new AudioContext();

      let analyser = audioContext.createAnalyser();
      let mediaStreamSource = audioContext.createMediaStreamSource(
        this.testStream
      );
      mediaStreamSource.connect(analyser);
      analyser.fftSize = 2048;
      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);
      let canvas = document.getElementById("oscilloscope");
      let canvasCtx = canvas.getContext("2d");
      function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgba(10, 129, 140)";

        canvasCtx.beginPath();

        let sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = (v * canvas.height) / 2;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }

      draw();
    },
    onDialogSave() {
      if (this.activeCamera) {
        this.switchCamera(this.activeCamera);
      }
      if (this.activeMicrophones) {
        this.switchMicrophones(this.activeMicrophones);
      }
      this.onDialogClose();
    },
    onActiveCameraChange(value) {
      if (value) this.ACTIVE_CAMERA(value);
    },
    onactiveMicrophonesChange(value) {
      if (value) this.ACTIVE_MICROPHONES(value);
    },
    format(percentage) {
      return percentage === 100 ? "最大音量" : `${percentage}%`;
    },
    play() {
      let options = {};
      if (this.activeMicrophones && this.activeMicrophones.deviceId) {
        options.audio = { deviceId: this.activeMicrophones.deviceId };
      } else {
        options.audio = false;
      }
      if (this.activeMicrophones && this.activeCamera.deviceId) {
        options.video = { deviceId: this.activeCamera.deviceId };
      } else {
        options.video = false;
      }
      if (options.video || options.audio) {
        navigator.mediaDevices.getUserMedia(options).then(testStream => {
          this.testStream = testStream;
          this.$nextTick(() => {
            this.$refs.video.srcObject = this.testStream;
            this.percentage = this.initWave();
          });
        });
      }
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
  width: 80%;
  height: auto;
  margin: 0 aut;
  video {
    width: 100%;
    height: 100%;
  }
}
.wave-container {
  width: 100%;
  height: 7rem;
  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
