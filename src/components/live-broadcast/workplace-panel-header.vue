<template>
  <div class="workplace-panel-header-component">
    <div class="menu-operation">
      <a @click="onCoursewareOpen"
        ><icon name="import_contacts" class="pannel-icon" :size="15"></icon
      ></a>
      <a><icon name="person_outline" class="pannel-icon" :size="15"></icon></a>
      <a><icon name="widgets" class="pannel-icon" :size="15"></icon></a>
      <a><icon name="settings" class="pannel-icon" :size="15"></icon></a>
      <a><icon name="exit_to_app" class="pannel-icon" :size="15"></icon></a>
      <a><icon name="info_outline" class="pannel-icon" :size="15"></icon></a>
    </div>
    <el-dialog
      title="课件库"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="onCoursewareClose"
      :append-to-body="true"
    >
      <div class="courseware-content"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "WorkplacePanelHeader",
  data() {
    return { dialogVisible: false };
  },
  methods: {
    onCoursewareOpen() {
      this.dialogVisible = true;

    },
    onCoursewareClose(done) {
      this.dialogVisible = false;
      if (done) {
        done();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.workplace-panel-header-component {
  height: 100%;
  width: 100%;
  color: #eee;
  position: relative;
}
.menu-operation {
  display: inline-block;
  padding: 0 2rem;
  float: right;
  height: 100%;
}
.menu-operation > a {
  height: auto;
  display: inline-block;
  line-height: 2rem;
  cursor: pointer;
}
.menu-operation > a:hover > svg {
  fill: #dcebeb;
}
.pannel-icon {
  fill: #8a8a8a;
  padding: 2.5px 4px;
  margin: 0 auto;
}

.courseware-content {
  min-height: 40vh;
}
</style>
