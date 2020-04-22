<template>
  <div class="main-workplace-container">
    <BoardTabs
      :lables.sync="lables"
      @on-close="onTabsClose($event)"
      :active-index.sync="index"
      @index-change="indexChange($event)"
      class="workplace-content"
    >
      <div id="board_el" style="height: 100%; width: 100%"></div>
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
      lables: []
    };
  },
  methods: {
    ...mapMutations("workplace", ["SET_BOARD_PROFILES"]),
    onTabsClose() {},
    getLables() {
      this.lables = this.boardProfiles.map(item => {
        return item.title;
      });
    },
    indexChange(index) {
      this.$store.commit("workplace/BOARD_INDEX", index);
    }
  },
  mounted() {
    liveBroadcastService.init();
    this.getLables();
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
    boardProfiles: {
      handler: function() {
        this.getLables();
      },
      deep: true
    },
    index(value) {
      let fileInfo = this.boardProfiles[value];
      console.log(fileInfo);
      liveBroadcastService.activeBoard.switchFile(
        fileInfo.fid,
        fileInfo.currentPageIndex,
        fileInfo.currentPageStep
      );
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
</style>
