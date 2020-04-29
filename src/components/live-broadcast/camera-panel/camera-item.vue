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
    </div>
    <div :id="item.id" ref="video" class="remote-video-view"></div>
    <div class="self-camera-footer">
      <div>
        <!-- <icon name="microphone" color="#0A818C" :size="18" />
        <voice-intensity :intensity="0.8" /> -->
      </div>
      <span>
        {{ item.userId }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "CameraItem",
  props: {
    item: {
      type: Object,
      default: () => {
        return { hasAudio: false, hasVideo: false, id: "", userId: "" };
      }
    }
  },
  data() {
    return {
      visibility: true
    };
  },
  methods: {
    ...mapMutations("remoteStream", ["SET_REMOTE_AUDIO", "SET_REMOTE_VIDEO"]),
    onMicroStateChange() {
      this.SET_REMOTE_AUDIO({
        id: this.item.id,
        status: !this.item.hasAudio
      });
    },
    onVideoStateChange() {
      this.SET_REMOTE_VIDEO({
        id: this.item.id,
        status: !this.item.hasVideo
      });
    }
  },
  mounted() {
    if (this.$refs.video) {
      this.$emit("on-ready", this.item.id, this.$refs.video);
    }
    console.log(this.item);
  },
  computed: {
    microIcon() {
      return this.item.hasAudio ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.item.hasVideo ? "video" : "video-slash";
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  background: #212224;
  margin: 10px 10px 5px;
  position: relative;
  width: calc(100% - 10px);
  height: calc(100% - 15px);
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
.remote-video-view {
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
