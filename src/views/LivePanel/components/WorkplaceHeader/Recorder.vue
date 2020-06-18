<template>
  <a @click="onRecord" v-if="onElectronClient">
    <icon
      :name="recorder ? 'video-slash' : 'video'"
      class="pannel-icon"
      :size="20"
    ></icon>
    <StreamSourceDialog
      :visible.sync="showSources"
      @selected="startRecord"
      ok-text="开始录制"
    />
  </a>
</template>
<script>
import { mapState } from "vuex";
import StreamSourceDialog from "@c/StreamSourceDialog";
import { liveBroadcastService } from "@/core/live-broadcast";
import { Emitter } from "@/core/emit";

const currentRecordAudioStreamList = [];
export default {
  name: "Recorder",
  data() {
    return {
      recorder: null,
      showSources: false,
      selected: null
    };
  },
  computed: {
    ...mapState("electron", ["onElectronClient"])
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
        new Date().getTime().toString()
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
