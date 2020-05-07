<template>
  <a @click="onRecord" v-if="onElectronClient">
    <icon
      :name="recorder ? 'video-slash' : 'video'"
      class="pannel-icon"
      :size="20"
    ></icon>
    <el-dialog :visible="showSources" :show-close="false" destroy-on-close>
      <stream-source :selected.sync="selected"></stream-source>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="showSources = false">取 消</el-button>
        <el-button
          type="primary"
          @click.stop="startRecord"
          :disabled="!selected"
        >
          开始录制
        </el-button>
      </span>
    </el-dialog>
  </a>
</template>
<script>
import { mapState } from "vuex";
import StreamSource from "@c/common/stream-source/index.vue";
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
    async startRecord() {
      this.showSources = false;
      const stream = await rtcService.getStream(this.selected.id);
      this.recorder = await rtcService.record(
        stream,
        new Date().getTime() + ".webm"
      );
    }
  },
  components: {
    StreamSource
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
