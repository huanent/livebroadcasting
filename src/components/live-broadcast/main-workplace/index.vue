<template>
  <div class="main-workplace-container">
    <BoardTabs
      :datas="boardProfiles"
      @on-close="onTabsClose"
      :active-index.sync="index"
      @index-change="indexChange($event)"
      @type-change="onChange"
      class="workplace-content"
    >
      <div class="board-wrapper" v-show="panelType === 'board'">
        <div id="board-el" class="roll-scroll"></div>
      </div>
      <div class="board-wrapper" v-show="panelType === 'screen'">
        <div style="height: 100%;width: 100%;background-color: #0a818c"></div>
      </div>
      <div class="board-wrapper" v-show="panelType === 'camera'">
        <div
          id="workplace-camera"
          style="height: 100%;width: 100%;background-color: #8c4651"
        ></div>
      </div>
    </BoardTabs>
    <div class="workplace-footer">
      <workplace-footer />
    </div>
    <Toolbar></Toolbar>
  </div>
</template>

<script>
import Toolbar from "../toolbar/index";
import BoardTabs from "./board-tabs";
import WorkplaceFooter from "../workplace-footer";
import { liveBroadcastService } from "../../../main";
import { mapMutations } from "vuex";

export default {
  name: "MainWorkplace",
  components: { Toolbar, BoardTabs, WorkplaceFooter },
  data() {
    return {
      panelType: "screen"
    };
  },
  methods: {
    ...mapMutations("workplace", ["SET_BOARD_PROFILES"]),
    onTabsClose(item, index) {
      this.$store.commit("workplace/DELETE_BOARD_FILE", item.fid);
    },
    indexChange(index) {
      this.$store.commit("workplace/BOARD_INDEX", index);
    },
    onChange(type) {
      this.panelType = type;
      if (this.panelType === "camera") {
        console.log("yes");
      }
    }
  },
  mounted() {
    liveBroadcastService.init();
  },
  computed: {
    boardProfiles() {
      return this.$store.state.workplace.boardProfiles;
    },
    index() {
      return this.$store.state.workplace.activeBoardIndex;
    }
  },
  watch: {
    index(value) {
      let fileInfo = this.boardProfiles[value];
      liveBroadcastService.switchFile(fileInfo.fid);
    }
  }
};
</script>

<style scoped lang="scss">
.main-workplace-container {
  height: 100%;
  width: 100%;
  position: relative;
}
.workplace-footer {
  height: 2rem;
  color: #737882;
  background-color: #171717;
}
.workplace-content {
  height: calc(100% - 2rem);
}
#board-el {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.board-wrapper {
  position: relative;
  height: calc(100% - 4rem);
  width: calc(100% - 10rem);
  margin: 2rem 5rem;
}
</style>
