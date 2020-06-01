<template>
  <el-dialog
    :title="$t('setting')"
    :visible="visibility"
    :width="dialogWidth"
    :append-to-body="true"
    @close="close"
  >
    <div class="dialog-item">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <div class="select-item">
            <div class="dialog-title">{{ $t("setting.camera") }}</div>
            <el-select
              v-if="access.video"
              style="width:100%"
              :value="selectedCamera"
              value-key="deviceId"
              @change="selectedCameraChanged"
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
              :value="selectedMicrophone"
              value-key="label"
              @change="selectedMicrophoneChanged"
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
        <el-col :xs="24" :sm="24" :md="12">
          <div class="media-container">
            <video ref="video" autoplay="autoplay" muted="true"></video>
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
          <el-button @click="close">{{ $t("button.close") }}</el-button>
          <el-button type="primary" @click="save()">{{
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
import { requestDeviceAccess } from "../../../core/utils";

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
      selectedCamera: null,
      selectedMicrophone: null,
      percentage: 0
    };
  },
  props: {
    visibility: {
      type: Boolean
    }
  },
  async mounted() {
    this.$once("hook:beforeDestroy", () => {
      if (this.audioLevelTimer) {
        clearInterval(this.audioLevelTimer);
      }
    });
    this.access = await requestDeviceAccess();
    this.cameras = await liveBroadcastService.trtcService.getCameras();
    this.microphones = await liveBroadcastService.trtcService.getMicrophones();
    if (this.cameras.length) {
      this.selectedCamera = this.cameras[0];
      this.selectedCameraChanged(this.selectedCamera);
    }
    if (this.microphones.length) {
      this.selectedMicrophone = this.microphones[0];
      this.selectedMicrophoneChanged(this.selectedMicrophone);
    }
  },

  computed: {
    ...mapState("device", ["isMobile"]),
    ...mapState("features", ["videoStatus", "audioStatus"]),
    dialogWidth() {
      return this.isMobile ? "80%" : "40%";
    }
  },
  methods: {
    async selectedCameraChanged(e) {
      this.selectedCamera = e;
      let stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: e.deviceId
        },
        audio: false
      });

      this.$refs.video.srcObject = stream;
    },
    async selectedMicrophoneChanged(e) {
      this.selectedMicrophone = e;

      let stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: e.deviceId
        }
      });

      this.initWave(stream);
    },
    initWave(stream) {
      let audioContext = new AudioContext();

      let analyser = audioContext.createAnalyser();
      let mediaStreamSource = audioContext.createMediaStreamSource(stream);
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
    async save() {
      if (this.selectedCamera) {
        await liveBroadcastService.trtcService.setCamera(
          this.selectedCamera.deviceId,
          this.videoStatus
        );
      }

      if (this.selectedMicrophone) {
        await liveBroadcastService.trtcService.setMicrophone(
          this.selectedMicrophone.deviceId,
          this.audioStatus
        );
      }

      this.close();
    },
    async close() {
      this.$emit("update:visibility", false);
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
  width: 100%;
  height: auto;
  margin: 0 auto;
  margin-top: 20px;
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
