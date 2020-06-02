<template>
  <div
    :class="{ 'self-camera-panel': true }"
    :draggable="isTeacher"
    @dragstart="dragstart"
  >
    <div class="self-camera-mask" v-if="isTeacher">
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
    <div
      v-show="item.subscribeVideo && stream.value"
      ref="video"
      class="remote-video-view"
    ></div>
    <div
      v-show="!item.subscribeVideo || !stream.value"
      class="remote-video-view"
    >
      <icon class="no-video" name="person" color="#34363b" />
    </div>
    <div class="self-camera-footer">
      <div>
        <!-- <icon name="microphone" color="#0A818C" :size="18" />
        <voice-intensity :intensity="0.8" /> -->
      </div>
      <span>
        {{ item.__nickName || item.__primaryKey }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import { Emitter } from "@/core/emit";
import { liveBroadcastService } from "../../../core/live-broadcast";
import { delay } from "../../../core/utils";

export default {
  name: "CameraItem",
  props: ["item"],
  data() {
    return {
      show: false,
      stream: {
        value: null,
        audio: null,
        video: null
      },
      active: true
    };
  },
  methods: {
    ...mapActions("features", ["manualControlFeatures"]),
    onMicroStateChange(el) {
      this.manualControlFeatures({
        id: this.item.__primaryKey,
        propName: "subscribeAudio",
        value: !this.item.subscribeAudio
      });
    },
    onVideoStateChange() {
      this.manualControlFeatures({
        id: this.item.__primaryKey,
        propName: "subscribeVideo",
        value: !this.item.subscribeVideo
      });
    },
    dragstart(e) {
      e.dataTransfer.setData("streamId", this.item.__streamId);
    }
  },
  async mounted() {
    this.active = true;
    while (this.active) {
      let stream = liveBroadcastService.trtcService.getRemoteStream(
        this.item.__streamId
      );
      if (!stream) {
        if (this.stream.value) this.stream.value.stop();
        this.stream.value = null;
        this.stream.audio = null;
        this.stream.video = null;
      } else {
        if (
          this.item.subscribeVideo != this.stream.video ||
          this.item.subscribeAudio != this.stream.audio
        ) {
          await liveBroadcastService.trtcService.subscribe(
            stream,
            this.item.subscribeAudio,
            this.item.subscribeVideo
          );
        }
        if (stream != this.stream.value) {
          stream.play(this.$refs.video);
          this.stream.value = stream;
        }
      }

      await delay(1000);
    }
  },
  beforeDestroy() {
    this.active = false;
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher"]),
    microIcon() {
      return this.item.subscribeAudio ? "microphone" : "microphone-slash";
    },
    videoIcon() {
      return this.item.subscribeVideo ? "video" : "video-slash";
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  background: #212224;
  position: relative;
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
    display: flex;
    justify-content: center;
    align-items: center;
    .self-camera-icons {
      position: relative;
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
    justify-content: center;
    align-items: center;
    height: 32px;
    line-height: 32px;
    color: #fff;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 35%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  &:hover {
    .self-camera-mask {
      visibility: visible;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}

.remote-video-view {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgb(52, 54, 58);
  .no-video {
    width: 100% !important;
    height: 100% !important;
    background-color: #202224;
  }
}
</style>
