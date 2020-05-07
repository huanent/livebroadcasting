<template>
  <a @click="onRecord" v-if="onElectronClient">
    <icon
      :name="recorder ? 'video-slash' : 'video'"
      class="pannel-icon"
      :size="20"
    ></icon>
    <stream-source-dialog
      :visible.sync="showSources"
      @selected="startRecord"
      ok-text="开始录制"
    />
  </a>
</template>
<script>
import { mapState } from "vuex";
import StreamSourceDialog from "@c/common/stream-source-dialog/index.vue";
export default {
  data() {
    return {
      recorder: null,
      showSources: false,
      selected: null
    };
  },
  computed: {
    ...mapState(["onElectronClient"])
  },
  methods: {
    async onRecord() {
      if (this.recorder) {
        this.recorder.stop();
        this.recorder = null;
      } else {
        this.showSources = true;
      }
    },
    async startRecord(stream) {
      this.recorder = await rtcService.record(
        stream,
        new Date().getTime() + ".webm"
      );
    }
  },
  components: {
    StreamSourceDialog
  }
};
</script>

<style lang="scss" scoped>
.pannel-icon {
  fill: #8a8a8a;
  padding: 2.5px 4px;
  margin: 0 auto;
}
</style>
