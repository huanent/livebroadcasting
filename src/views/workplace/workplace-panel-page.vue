<template>
  <div class="workplace-panel">
    <div class="workplace-panel-header"></div>
    <div class="workplace-panel-content">
      <div id="workplace-panel-left">
        <div class="camera—pannel"></div>
        <div id="gutter1-1" class="gutter-row"></div>
        <div class="main—workplace-pannel">
          <toolbar />
        </div>
      </div>
      <div id="gutter" class="gutter-col"></div>
      <div id="workplace-panel-right">
        <div class="self-camera—pannel"></div>
        <div id="gutter2-1" class="gutter-row"></div>
        <div class="message—pannel"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Split from "split-grid";
import Toolbar from "@c/common/Toolbar";
export default {
  name: "workplace-panel-page",
  data: function() {
    return {
      gridStyle: undefined,
      originPosition: [0, 0],
      total: 0,
    };
  },
  components: {
    // ChatRoom,
    Toolbar,
  },
  mounted() {
    Split({
      columnGutters: [
        {
          track: 1,
          element: document.querySelector("#gutter"),
        },
      ],
      rowGutters: [
        {
          track: 1,
          element: document.querySelector("#gutter1-1"),
        },
        {
          track: 1,
          element: document.querySelector("#gutter2-1"),
        },
      ],
    });
    console.log(Split);
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.workplace-panel {
  display: grid;
  height: 100vh;
  grid-template-rows: 42px auto;
}
.workplace-panel-header {
  background: #34363b;
}
.workplace-panel-content {
  display: grid;
  grid-template-columns: 80% 2px auto;
  height: 100%;
}
#workplace-panel-left {
  background: #1a1b1d;
  display: grid;
  grid-template-rows: 20% 2px auto;
  div {
    height: 100%;
  }
}
#workplace-panel-right {
  background: #212224;
  display: grid;
  grid-template-rows: 20% 2px auto;
  div {
    height: 100%;
  }
}
#gutter {
  background-color: #292929;
}
.gutter-row {
  cursor: row-resize;
}
.gutter-col {
  cursor: col-resize;
}
.camera—pannel {
  background: #212224;
}
.main—workplace-pannel {
  background: #1a1b1d;
}
.self-camera—pannel {
  background: #212224;
}
.message—pannel {
  background: #292b2e;
}
</style>
