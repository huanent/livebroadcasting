<template>
  <div class="main-workplace-container">
    <BoardTabs
      :lables.sync="lables"
      @on-close="onTabsClose($event)"
      :active-index.sync="index"
      @index-change="indexChange($event)"
    >
      <div id="board_el" style="height: 100%; width: 100%"></div>
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
export default {
  name: "MainWorkplace",
  components: { Toolbar, BoardTabs },
  data() {
    return {
      lables: [],
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
    },
    indexChange(index) {
      console.log(this.boardProfiles[index]);
    }
  },
  mounted() {
    liveBroadcastService.init();
    this.getLables();
    /*this.SET_BOARD_PROFILES(this.boardProfiles);*/
  },
  computed: {
    boardProfiles() {
      return this.$store.state.workplace.boardProfiles;
    }
  },
  watch: {
    boardProfiles: {
      handler: function() {
        this.getLables();
      },
      deep: true
    },
    index: function(value) {
      console.log(this.boardProfiles[value]);
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
