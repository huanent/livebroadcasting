<template>
  <div class="setting-wrap">
    <el-tabs type="border-card" class="setting-tabs">
      <el-tab-pane :label="$t('setting.personInfoEdit')">
        <person-info-edit @update="update" :userInfo="userInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PersonInfoEdit from "./person-info-edit";

export default {
  name: "MySetting",
  props: {
    userInfo: Object
  },
  methods: {
    update(data) {
      this.$emit("update");
    }
  },
  components: {
    PersonInfoEdit
  }
};
</script>

<style lang="scss" scoped>
.setting-wrap {
  width: 1205px;
  margin: 20px auto;
  @media screen and (max-width: 1200px) {
    width: auto;
  }
  .setting-tabs {
    /deep/ .el-tabs__item {
      height: 44px;
      line-height: 44px;
      font-size: 15px;
    }
    /deep/ .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }
}
</style>
