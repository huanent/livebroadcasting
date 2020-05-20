<template>
  <el-dialog
    title="设置"
    :visible.sync="visibility"
    width="40%"
    :before-close="onDialogClose"
    :append-to-body="true"
  >
    <div>
      <div class="dialog-item">
        <div class="dialog-title">摄像头</div>
        <el-select
          style="width:100%"
          :value="activeCamera"
          @input="onActiveCameraChange"
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
      <div class="dialog-item">
        <div class="dialog-title">麦克风</div>
        <el-select
          style="width:100%"
          :value="activeMicrophones"
          @input="onactiveMicrophonesChange"
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
      <div class="dialog-item">
        <div class="dialog-title"></div>
        <div class="dialog-title">麦克风测试</div>
        <VoiceProgress :percentage="percentage" style="height: 3rem" />
        <!--       <el-progress :percentage="100" :format="format"></el-progress>-->
      </div>
      <!--      <div class="dialog-item">
        <div class="dialog-title">扬声器</div>
        <el-select
          style="width:100%"
          v-model="activeLoudspeakersDevice"
          placeholder="请选择扬声器设备"
        >
          <el-option
            v-for="item in microphonesDeviceList"
            :key="item.deviceId"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>-->
      <!--      <div class="dialog-item loudspeaker">
        <icon
          name="loudspeaker"
          color="#737882"
          :size="18"
          style="margin-left:8px"
        />
        <span>测试扬声器</span>
      </div>-->
      <div class="btn-list">
        <el-button @click="onDialogClose()">取 消</el-button>
        <el-button type="primary" @click="onDialogSave()">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";
import VoiceProgress from "./voice-progress";
export default {
  name: "LocalstreamSetting",
  data() {
    return {
      activeLoudspeakersDevice: {},
      microphonesDeviceList: [],
      cameraDeviceList: [],
      percentage: 50,
      mediaDevices: undefined
    };
  },
  props: {
    visibility: {
      type: Boolean
    }
  },
  mounted() {
    this.cameraDeviceList = [];
    this.microphonesDeviceList = [];

    window.test = this;
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
      mediaDevices.forEach(item => {
        let devices = {
          kind: item.kind,
          deviceId: item.deviceId,
          label: item.label
        };
        if (
          devices.deviceId !== "communications" &&
          devices.deviceId !== "default"
        ) {
          if (devices.kind === "videoinput") {
            this.cameraDeviceList.push(devices);
          }
          if (devices.kind === "audioinput") {
            this.microphonesDeviceList.push(devices);
          }
        }
      });
    });
  },

  computed: {
    ...mapState("workplace", ["activeCamera", "activeMicrophones"])
  },
  methods: {
    ...mapMutations("workplace", ["ACTIVE_CAMERA", "ACTIVE_MICROPHONES"]),
    ...mapActions("workplace", ["switchCamera", "switchMicrophones"]),
    onDialogClose() {
      this.$emit("update:visibility", false);
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
    onActiveCameraChange(e) {
      this.ACTIVE_CAMERA(e);
    },
    onactiveMicrophonesChange(e) {
      this.ACTIVE_MICROPHONES(e);
    },
    format(percentage) {
      return percentage === 100 ? "最大音量" : `${percentage}%`;
    }
  },
  components: {
    VoiceProgress
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  /* background: #212224;*/
  min-height: 400px;
}
/*/deep/ .el-dialog__title {
      color: white;
    }*/

.dialog-item {
  margin-bottom: 15px;
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
</style>
