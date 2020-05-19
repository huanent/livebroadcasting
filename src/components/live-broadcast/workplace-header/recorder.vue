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
import StreamSourceDialog from "@c/common/stream-source-dialog/index.vue";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";
import { Emitter } from "../../../core/emit";
let vm;
let tracksStore = {};
window.test = tracksStore;
export default {
  data() {
    vm = this;
    return {
      recorder: null,
      showSources: false,
      selected: null
    };
  },
  computed: {
    ...mapState("electron", ["onElectronClient"]),
    ...mapState("workplace", ["featuresList"])
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
      let tracks = [];
      vm.featuresList.forEach(features => {
        if (features.subscribeAudio) {
          let trtcStream = liveBroadcastService.trtcService.getRemoteStreamByUserId(
            features.__primaryKey
          );
          if (trtcStream) {
            let audioTrackProfile = {};

            let audioTracks = trtcStream.mediaStream_.getAudioTracks();

            if (audioTracks && audioTracks.length) {
              audioTracks.forEach(track => {
                audioTrackProfile[track.id] = track;
                stream.addTrack(track);
              });
            }
            tracksStore[features.__primaryKey] = {
              id: features.__primaryKey,
              audioTrackProfile
            };
          }
        }
      });

      Emitter.on("ADD_AUDIO_TRACK", id => {
        console.log("ADD_AUDIO_TRACK");
      });
      Emitter.on("REMOVE_AUDIO_TRACK", id => {
        console.log("REMOVE_AUDIO_TRACK");
        console.log(id);
        let trackStore = tracksStore[id];
        if (trackStore) {
          for (let i in trackStore.audioTrackProfile) {
            if (stream.getTrackById()) {
            }
          }
        }
      });
      console.log("=========---------------===============");
      console.log(stream.getAudioTracks());
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
