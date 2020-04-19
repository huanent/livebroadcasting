<template>
  <div class="main-workplace-container">
    <BoardTabs :lables.sync="lables" @on-close="onTabsClose($event)">
      <BoardTabsItem style="background-color: #0a818c;height:100%;"
        ><div id="board_el" style="height: 400px; width: 560px"></div
      ></BoardTabsItem>
      <BoardTabsItem style="background-color: #8c436a;height:100%;"
        >2</BoardTabsItem
      >
      <BoardTabsItem style="background-color: #888c2f;height:100%;"
        >3</BoardTabsItem
      >
    </BoardTabs>
    <Toolbar></Toolbar>
  </div>
</template>

<script>
import Toolbar from "../toolbar/index";
import BoardTabs from "./board-tabs";
import BoardTabsItem from "./board-tabs-item";
import { liveBroadcastService } from "../../../main";
// import { enterRoom } from "../../../core/data/data-service";
export default {
  name: "MainWorkplace",
  components: { Toolbar, BoardTabs, BoardTabsItem },
  data() {
    return {
      lables: ["开学第一课.ppt", "开学第二课.ppt", "开学第三课.ppt"],
      index: 0
    };
  },
  methods: {
    onTabsClose() {}
  },
  mounted() {
    liveBroadcastService.init();
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
