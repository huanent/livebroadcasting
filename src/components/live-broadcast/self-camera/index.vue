<template>
  <div
    :class="{ 'self-camera-panel': true }"
    :draggable="isTeacher"
    @dragstart="dragstart"
  >
    <camera
      :stream-id="streamId"
      controllable
      :subscribe-audio="true"
      :subscribe-video="true"
      always-local-muted
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { Emitter } from "../../../core/emit";
import { liveBroadcastService } from "../../../core/live-broadcast";
import Camera from "../../common/camera";
export default {
  name: "SelfCamera",
  data() {
    return {
      visibility: false,
      showSettings: true
    };
  },
  components: {
    Camera
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher", "teacherStreamId"]),
    ...mapState("workplace", ["token"]),
    ...mapState("account", ["userInfo"]),

    streamId() {
      return this.isTeacher ? "__local" : this.teacherStreamId;
    }
  },
  methods: {
    dragstart(e) {
      e.dataTransfer.setData("streamId", this.token.id);
    }
  }
};
</script>

<style scoped lang="scss">
.self-camera-panel {
  @include themeify {
    background: themed("background_color2");
  }
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
  position: relative;
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
