<template>
  <div class="main-workplace-container">
    <BoardTabs
      :lables.sync="lables"
      @on-close="onTabsClose($event)"
      :active-ndex="index"
    >
      <BoardTabsItem v-for="(item, index) in boardProfiles"
        ><div :id="'board_el_' + index" style="height: 100%; width: 100%"></div
      ></BoardTabsItem>
    </BoardTabs>
    <Toolbar></Toolbar>
  </div>
</template>

<script>
import Toolbar from "../toolbar/index";
import BoardTabs from "./board-tabs";
import BoardTabsItem from "./board-tabs-item";
import { liveBroadcastService } from "../../../main";
import { mapMutations } from "vuex";
// import { enterRoom } from "../../../core/data/data-service";
export default {
  name: "MainWorkplace",
  components: { Toolbar, BoardTabs, BoardTabsItem },
  data() {
    return {
      lables: [],
      boardProfiles: this.$store.state.workplace.boardProfiles,
      index: this.$store.state.workplace.activeBoardIndex
    };
  },
  methods: {
    ...mapMutations("workplace", ["SET_BOARD_PROFILES"]),
    onTabsClose() {},
    getLables() {
      let temp = this.boardProfiles.map(item => {
        return item.title;
      });
      this.lables = temp;
    }
  },
  mounted() {
    liveBroadcastService.init();
    this.getLables();
    /*this.SET_BOARD_PROFILES(this.boardProfiles);*/
  },
  watch: {
    boardProfiles: {
      handler: function() {
        this.getLables();
      },
      deep: true
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
</style>
